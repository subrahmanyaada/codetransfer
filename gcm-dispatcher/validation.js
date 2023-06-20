const {
  consoleLog,
  strEmpty,
  stringifyObject,
  isObjectEmpty,
} = require("./utils/tools");

function validateConfig(config) {
  // consoleLog(
  //   "validatePartnerConfigForCtap -> config = " + (config)
  // );

  const serviceId = config.serviceId;
  const consumeQExchangeName = config.config.consumeQ.exchangeName;
  const consumeQName = config.config.consumeQ.qName;
  const consumeQRoutingKey = config.config.consumeQ.routingKey;
  const emit = config.config.emit;
  const delayTime = config.config.emit.delayTime;

  if (
    strEmpty(serviceId) ||
    strEmpty(consumeQExchangeName) ||
    strEmpty(consumeQName) ||
    strEmpty(consumeQRoutingKey) ||
    strEmpty(emit) ||
    strEmpty(delayTime) 
  ) {
    throw new Error(
      "missing mandotory params serviceId, ConsumeQ{ExchangeName, QName, RoutingKey} delay time"
    );
  }
}

module.exports = { validateConfig };
