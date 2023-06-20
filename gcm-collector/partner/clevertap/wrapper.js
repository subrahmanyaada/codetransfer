const { consoleLog, strEmpty, stringifyObject } = require("../../utils/tools");

function createMessagePayloadForCtap(config, reqBody) {
  consoleLog("createMessagePayloadForCtap -> config = " + stringifyObject(config) + reqBody)

  const partnerId = config.partnerId;
  const partnerQName = config.partnerQName;
  const partnerRoutingKey = config.partnerRoutingKey;
//   const partnerMessage = config.partnerMessage;
  const clientId = config.tenantId;
  const header = config.header;
  const consumerDetails = config.bmp
  const dateTime = Date.now();

  const partnerPayload = {
    partnerId: partnerId,
    partnerPayload: reqBody,
    tenantId: clientId,
    header: header,
    // partnerMessage: partnerMessage,
    dateTime: dateTime,
    partnerQName: partnerQName,
    partnerRoutingKey: partnerRoutingKey,
    consumerDetails: consumerDetails
  };

  return partnerPayload
}

module.exports = { createMessagePayloadForCtap };
