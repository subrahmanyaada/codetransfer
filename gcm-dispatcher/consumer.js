// const amqp = require("amqplib");
const { config, serviceId, partnerIdClevertap } = require("./serviceconfig");
const { storeBmpAcknowledgement, getConfig } = require("./utils/stores");
const fs = require("fs");
const { apiRequest } = require("./utils/network");
const { parseObject, stringifyObject, consoleLog } = require("./utils/tools");
const { validateConfig } = require("./validation");

//Consume class to consume the created the queue where clevertap message/payload will be there
class Consume {
  // channel

  //Establishing connection with RabbitMQ

  
  // async createChannel() {
  //   const connection = await amqp.connect(config.rabbitMQ.url);
  //   this.channel = await connection.createChannel();
  // }


  async getConfigs(serviceId, partnerId) {
    const config = await getConfig(serviceId, partnerId);
    // consoleLog("getConfigForCtap config="+stringifyObject(config))
    validateConfig(config);
    return config;
  }

  async createChannel(rabbitChannel) {
    const config = await this.getConfigs(serviceId, partnerIdClevertap);
    // this.channel = await connectToMessageBroker(rabbitConfig)
    await this.consumeMessages(
      rabbitChannel,
      serviceId,
      partnerIdClevertap,
      config.config
    );
  }

  //Function to consume the message
  async consumeMessages(
    channel,
    serviceId,
    partnerId,
    config
  ) {
    const exchangeName = config.consumeQ.exchangeName;
    const qName = config.consumeQ.qName;
    const routeKeyQ1 = config.consumeQ.routingKey;

    await channel.assertExchange(exchangeName);
    const q = await channel.assertQueue(qName);
    await channel.bindQueue(q.queue, exchangeName, routeKeyQ1);

    channel.consume(q.queue, (msg) => {
      if (msg.content) {
        const msgContent = parseObject(msg.content.toString());
        // TODO optimise later
        const payload = isFormData(msgContent);
        channel.ack(msg); 
        setTimeout(this.onTimeOut, config.emit.delayTime, payload); //TODO: delayTime comes from config
      }
      // channel.ack(msg); // may be later move this to no ack
    });
  }

  async onTimeOut(transform) {
    consoleLog("Before calling BMP API payload = "+stringifyObject(transform.message));
    consoleLog(`Before calling BMP API ${Date.now() - transform.dateTime}`);

    /**
     apiRequest = {
      "method":"post",
      "url":"https://bizmsgapi.ada-asia.com/prod/message",
      "headers":{"Content-Type":"application/json","Authorization":"Bearer <TODO INSERT>"},
      "data":{"platform":"WA","from":"94720290996","to":"60195698825","type":"text","text":"Test 6"}}
     
     const config = {
      "Configuration": {
          method: 'post',
          // maxBodyLength: config.maxBodyLength,
          url: transformedData.url,
          headers: {
              'Content-Type': transformedData.contentType,
              'Authorization': config.bmp.bearer 
          },
          data: transformedData.data
      }, "msgId": payload.msgId
  }
     */
  
  

    const result = await apiRequest(transform.message);
    consoleLog(`BMP response ${stringifyObject(result)} ${Date.now() - transform.dateTime}`);
    consoleLog(`${Date.now() - transform.dateTime}`);
    storeBmpAcknowledgement(result, transform.partnerMsgId);
  }
}

function isFormData(payload) {
  const tranformedPayload = { ...payload };
  const urlString = payload.message.url;
  const parts = urlString.split("/"); // Split the URL string by "/"
  const media = parts[parts.length - 1];
  if (media == "media") {
    let data = payload.message.data;
    let transformedFormData = new FormData();
    Object.keys(data).map((eachKey, keyIndex) => {
      transformedFormData.append(
        eachKey,
        eachKey == "file" ? fs.createReadStream(data[eachKey]) : data[eachKey]
      );
    });
    tranformedPayload.message.data = transformedFormData;
  }

  return tranformedPayload;
}

module.exports = Consume;
