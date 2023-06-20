/**
 * Caution while making changes to this file.
 * Any changes done here may have major impact resulting in service outage
 */

const serviceId = "collector";

const rabbitMQConfig = {
  url: "amqp://127.0.0.1",
  //  url: "amqp://rabbitmq:5672",
  exchangeName: "logExchange",
};

const redisConfig = {
  host: "127.0.0.1",
  // host: 'redis',
  port: 6379,
};

const partnerIdClevertap = "ctap";
const partnerIdMoengage = "moengage";

const env_prod = false;
const env_dev = true;
const enableLogging = true;

module.exports = {
  serviceId,
  rabbitMQConfig,
  redisConfig,
  partnerIdClevertap,
  partnerIdMoengage,
  env_dev,
  env_prod,
  enableLogging,
};
