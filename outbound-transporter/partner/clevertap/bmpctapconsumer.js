const amqp = require("amqplib");
const Dispatch = require("../../dispatch");
const dispatch = new Dispatch();
const { transform } = require("./bmpCtapTransformation");
const { validateBmpPayload } = require("./bmpvalidation");
const { storeTransformedMessage } = require("../../utils/stores");
const {config} = require("../../serviceconfig");
const { objectNotEmpty,parseObject, stringifyObject, consoleLog } = require("../../utils/tools");

async function createChannel() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();
  return channel;
}

async function consumeBmpCtapMessages(channel) {
  if (!channel) {
    channel = await createChannel();
  }

  const exchangeName = config.ctapConsumeQ.exchangeName;
  const qName = config.ctapConsumeQ.qName;
  const routeKeyQ1 = config.ctapConsumeQ.routingKey;
  await channel.assertExchange(exchangeName);

  const q = await channel.assertQueue(qName);

  await channel.bindQueue(q.queue, exchangeName, routeKeyQ1);

  channel.consume(q.queue, async (msg) => {
    const message = parseObject((msg.content.toString()));
    await onTimeOut(message, channel, msg);
  });
}

async function onTimeOut(partnerDetails, channel, msg) {

  const payload = partnerDetails.data
  const headers = partnerDetails.header
  const isValidate = validateBmpPayload(headers, payload);
  if (isValidate) {
    // TODO: transform
    const result = await transform(headers, payload);
    consoleLog(`onTimeOut result = ${stringifyObject(result)}`)

    if (objectNotEmpty(result)) {
      const key = 'out' + "-" + 'bmp' + "-" + 'ctap' + "-" + result["msgId"];
      consoleLog(`ontimekey key=  ${key}`)

      // Storing transformed data
      storeTransformedMessage(key, result);

      consoleLog(`\n Timetaken to transformation from the collection ${Date.now() - partnerDetails.dateTime}`);

      const routingKey = config.dispatchQ.routingKey;
      result["dateTime"] = partnerDetails.dateTime
      result["partnerMsgId"] = "todo"
      await dispatch.publishMessage(routingKey, result);
    } else {
      consoleLog(`unsupported operation !!!`)
    }
    channel.ack(msg);
  } else {
    // TODO throw error
    consoleLog("Required fields are not there");
    channel.ack(msg); // Acknowledge the message to remove it from the queue
  }
}

module.exports = { consumeBmpCtapMessages, onTimeOut };
