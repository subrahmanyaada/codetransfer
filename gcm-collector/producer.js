const amqp = require("amqplib");
const { rabbitMQConfig } = require("./serviceconfig");
const { stringifyObject, consoleLog, strEmpty, isObjectEmpty } = require("./utils/tools");

//Class to publsih the message
class Producer {
  channel;

  //Function to create channel connection with the RabbbitMQ
  async createChannel(rabbitConfig) {
    const connection = await amqp.connect(rabbitConfig.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(serviceId, partnerId, partnerPayload) {
    if (!this.channel) {
      throw new Error("RabbitMQ not init cannot proceed")
    }

    if(strEmpty(serviceId) || strEmpty(partnerId) || isObjectEmpty(partnerPayload)) {
      throw new Error("collector --> Error publishMessage for partner="+partnerId+" missing mandatory params")
    }

    //Creating an exchange
    const exchangeName = rabbitMQConfig.exchangeName;
    await this.channel.assertExchange(exchangeName);

    //Publishing an exchange
    consoleLog("publishmessage --> exchangeName="+exchangeName+" routingkey="+ partnerPayload.partnerRoutingKey+" ")
    await this.channel.publish(
      exchangeName,
      partnerPayload.partnerRoutingKey,
      Buffer.from(stringifyObject(partnerPayload))
    );

    // `Consumer emit ${routingKey} log is sent to exchange ${exchangeName}`
    consoleLog("Consumer emit ");
  }
}

module.exports = Producer;
