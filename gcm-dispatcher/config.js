class Config {
  constructor() {
  }

  storeConfigData(data) {
    this.rabbitMQ = {
      url: "amqp://127.0.0.1",
      //  url: "amqp://rabbitmq:5672",
      exchangeName: "logExchange",
  },
    this.redis = data.redis,
    this.consumeQ= data.consumeQ,
    this.env_prod = data.env_prod,
    this.env_dev = data.env_dev,
    this.emit = data.emit
  }
}

module.exports = Config;

