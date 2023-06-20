const amqp = require("amqplib");
const { rabbitMQConfig, partnerIdClevertap } = require("./serviceconfig");
const Consumer = require("./partner/consumer");
const consumer = new Consumer();
const Dispatch = require("./dispatch");
const { consoleLog } = require("./utils/tools");
const dispatch = new Dispatch();

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
  consumer.createChannel(rabbitChannel, dispatch);
  // dispatch.createChannel(rabbitChannel);
}

async function listen() {
  await initServiceDependencies()
}

listen()