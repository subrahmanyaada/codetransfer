const amqp = require("amqplib");
const {
  config,
  serviceId,
  partnerIdClevertap,
} = require("../../serviceconfig");
const { transform } = require("./ctaptransformation");
const { validateCleverTapPayload } = require("./payloadValidation");
const { storeTransformedMessage, getConfig, getPartnerConfigKey } = require("../../utils/stores");
const { parseObject, consoleLog, stringifyObject } = require("../../utils/tools");
const { handleErrorForCtap } = require("./error");
const { validatePartnerConfigForCtap } = require("./validation");

async function getConfigForCtap(serviceId, partnerId) {
  const config = await getConfig(serviceId, partnerId);
  // consoleLog("getConfigForCtap config="+stringifyObject(config))
  validatePartnerConfigForCtap(config)
  return config
}

async function consumeMessages(channel, serviceId, partnerId, configPayload, dispatch) {
  try {
    const config = configPayload.config
    const exchangeName = config.consumeQ.exchangeName;
    const qName = config.consumeQ.qName;
    const routeKeyQ1 = config.consumeQ.routingKey;
    
    await channel.assertExchange(exchangeName+"");
    const q = await channel.assertQueue(qName);

    await channel.bindQueue(q.queue, exchangeName, routeKeyQ1);

    channel.consume(q.queue, async (msg) => {
      const message = parseObject(msg.content.toString());
      await onTimeOut(message, channel, msg, configPayload.config, dispatch);
    });
  } catch(exception) {
    consoleLog("ctap consumeMessages error = " + exception);
    handleErrorForCtap(partnerId, exception);
  }
}

async function onTimeOut(partnerDetails, channel, msg, config, dispatch) {
  const payload = partnerDetails.partnerPayload;
  const isValidate = validateCleverTapPayload(payload);
  if (isValidate) {
    // transform
    const result = transform(payload, config);
    consoleLog("transformed message = "+stringifyObject(result))
    // Storing transformed data
    storeTransformedMessage(partnerDetails.partnerId, result);

    result.dateTime = Date.now();

    consoleLog(
      `\n\nTimetaken to transformation from the collection ${
        Date.now() - partnerDetails.dateTime
      }`
    );
    await dispatch.publishMessage(channel, config, result);
    channel.ack(msg);
  } else {
    consoleLog("Required fields are not there");
    channel.ack(msg); // Acknowledge the message to remove it from the queue
  }
}

module.exports = { consumeMessages, getConfigForCtap };
