// const amqp = require("amqplib");
const { serviceId, partnerIdClevertap } = require("../serviceconfig");
// const { getConfig } = require("../utils/stores");
const { consumeMessages, getConfigForCtap } = require("./clevertap/ctapconsumer");
const { consoleLog } = require("../utils/tools");

// Consume class to consume the CleverTap message/payload and transform it as per the BMP request
class Consumer {
  // channel

  //Function to create channel connection with the RabbbitMQ
  async createChannel(rabbitChannel, dispatch) {
    const configCtap = await getConfigForCtap(serviceId, partnerIdClevertap)
    // this.channel = await connectToMessageBroker(rabbitConfig)
    await consumeMessages(rabbitChannel, serviceId, partnerIdClevertap, configCtap, dispatch);
  }
}

module.exports = Consumer;
