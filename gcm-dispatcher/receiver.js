const amqp = require("amqplib");
const { rabbitMQConfig, partnerIdClevertap } = require("./serviceconfig");
const Consumer = require("./consumer");
const consumer = new Consumer();
const { consoleLog } = require("./utils/tools");

async function connectToMessageBroker(rabbitConfig) {
  const connection = await amqp.connect(rabbitConfig.url);
  const channel = await connection.createChannel();
  if (!channel) {
    throw new Error("RabbitMQ not init cannot proceed")
  }
  return channel
}

async function initServiceDependencies() {
  const rabbitChannel = await connectToMessageBroker(rabbitMQConfig)
  consumer.createChannel(rabbitChannel);
}

async function listen() {
  await initServiceDependencies()
}

listen()








// const Consume = require("./consumer");
// const { loadConfiguration } = require("./serviceconfig");
// const { getConfig } = require("./utils/stores");
// const consume = new Consume();

// async function listen() {
//   // const configData = stringifyObject({
//   //   rabbitMQ: {
//   //     url: "amqp://127.0.0.1"
//   //   },
//   //   redis: {
//   //     host: '127.0.0.1',
//   //     port: 6379,
//   //   },
//   //   consumeQ: {
//   //     exchangeName: "dispatcherEx",
//   //     qName: "dispatcherQ",
//   //     routingKey: "dispatch"
//   //   },
//   //   emit: {
//   //     delayTime : 5
//   //   },
//   //   env_prod : false,
//   //   env_dev : true
//   // })

//   const configData = await getConfig('dispatcher')
//   loadConfiguration(configData.config)
  
//   //Calling consumeMessages function of Consume class to consume the created queue.
//   await consume.consumeMessages()
// }

// listen()
