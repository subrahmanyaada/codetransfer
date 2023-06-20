// const amqp = require("amqplib");
// const {config} = require("./serviceconfig");
const { stringifyObject, consoleLog } = require("./utils/tools");

//Dispatching the transformed data 
class Dispatch {
  // channel;

  // async createChannel(rabbitChannel) {
  //   const connection = await amqp.connect(config.rabbitMQ.url);
  //   this.channel = await connection.createChannel();
  // }

  async publishMessage(rabbitChannel, config, payload) {
    if (!rabbitChannel) {
      throw new Error("RabbitMQ not init cannot proceed")
    }

    const exchangeName = config.dispatchQ.exchangeName;
    const routingKey = config.dispatchQ.routingKey;

    await rabbitChannel.assertExchange(exchangeName);

    const logDetails = {
      logType: routingKey,
      message: payload.Configuration,
      dateTime: payload.dateTime,
      partnerMsgId : payload.msgId
    };

    await rabbitChannel.publish(
      exchangeName,
      routingKey,
      Buffer.from(stringifyObject(logDetails))
    );

    // `Transport Dispatch ${routingKey} log is sent to exchange ${exchangeName}`
    consoleLog( `Transport Dispatch `)
  }
}

module.exports = Dispatch;
