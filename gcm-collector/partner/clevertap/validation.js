const { consoleLog, strEmpty, stringifyObject, isObjectEmpty } = require("../../utils/tools");

function validatePartnerConfigForCtap(config) {
  consoleLog("validatePartnerConfigForCtap -> config = " + stringifyObject(config))

  const partnerId = config.partnerId;
  const partnerQName = config.partnerQName;
  const partnerRoutingKey = config.partnerRoutingKey;
//   const partnerMessage = config.partnerMessage;
  const clientId = config.tenantId;
  const header = config.header;
  const consumerDetails = config.bmp
//   const dateTime = Date.now();

  if (
    strEmpty(partnerId) ||
    strEmpty(partnerQName) ||
    strEmpty(partnerRoutingKey) ||
    // strEmpty(partnerMessage) ||
    strEmpty(clientId) ||
    strEmpty(header) ||
    isObjectEmpty(consumerDetails) ||
    isObjectEmpty(consumerDetails.url) ||
    isObjectEmpty(consumerDetails.bearer)
  ) {
    throw new Error(
      "missing mandotory params partnerId, partnerQName, partnerRoutingKey, partnerMessage, clientId, header, url, bearer "
    );
  }
}

module.exports = { validatePartnerConfigForCtap };
