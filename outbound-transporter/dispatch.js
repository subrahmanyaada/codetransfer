const amqp = require("amqplib");
const {config} = require("./serviceconfig");
const { stringifyObject, consoleLog } = require("./utils/tools");


//Dispatching the transformed data 
class Dispatch {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey, payload) {
    if (!this.channel) {
      await this.createChannel();
    }
    
    const exchangeName = config.dispatchQ.exchangeName;
    // const routingKey = config.dispatchQ.routingKey;

    await this.channel.assertExchange(exchangeName);

    const payloadOutTransDispatch = {
      logType: routingKey,
      message: payload.Configuration,
      dateTime: payload.dateTime,
      partnerMsgId : payload.partnerMsgId
    };

    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(stringifyObject(payloadOutTransDispatch))
    );

    // console.log(`Transport Dispatch payload = `+JSON.stringify(payloadOutTransDispatch));
    consoleLog(`Transport Dispatch `);
  }
}

module.exports = Dispatch;
