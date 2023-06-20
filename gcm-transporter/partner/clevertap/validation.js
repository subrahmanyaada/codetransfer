const {
  consoleLog,
  strEmpty,
  stringifyObject,
  isObjectEmpty,
} = require("../../utils/tools");

function validatePartnerConfigForCtap(config) {
  // consoleLog(
  //   "\n\nvalidatePartnerConfigForCtap -> config = \n\n" + stringifyObject(config)
  // );

  const serviceId = config.serviceId;
  const partnerId = config.config.partnerId;
  const consumeQExchangeName = config.config.consumeQ.exchangeName;
  const consumeQName = config.config.consumeQ.qName;
  const consumeQRoutingKey = config.config.consumeQ.routingKey;
  const dispatchQExchangeName = config.config.dispatchQ.exchangeName;
  const dispatchQName = config.config.dispatchQ.qName;
  const dispatchQRoutingKey = config.config.dispatchQ.routingKey;
  const header = config.config.header;
  const consumerDetails = config.config.bmp;

  if (
    strEmpty(serviceId) ||
    strEmpty(partnerId) ||
    strEmpty(consumeQExchangeName) ||
    strEmpty(consumeQName) ||
    strEmpty(consumeQRoutingKey) ||
    strEmpty(dispatchQExchangeName) ||
    strEmpty(dispatchQName) ||
    strEmpty(dispatchQRoutingKey) ||
    isObjectEmpty(header) ||
    isObjectEmpty(consumerDetails) ||
    strEmpty(consumerDetails.platform) ||
    strEmpty(consumerDetails.channel) ||
    strEmpty(consumerDetails.bearer) ||
    strEmpty(consumerDetails.urlFreeFormText) ||
    strEmpty(consumerDetails.urlFreeFormImage) ||
    strEmpty(consumerDetails.urlTemplateText) ||
    strEmpty(consumerDetails.urlTemplateHeader)
  ) {
    throw new Error(
      "missing mandotory params serviceId, partnerId, consumeQ{ExchangeName, QName, RoutingKey}, "+
      "dispatchQ{ExchangeName, QName, RoutingKey} header bmp "
    );
  }
}

module.exports = { validatePartnerConfigForCtap };
