const { env_dev, enableLogging } = require("../serviceconfig");

function stringifyObject(obj) {
  return JSON.stringify(obj);
}

function parseObject(obj) {
  return JSON.parse(obj);
}

function isObjectEmpty(objectName) {
  // consoleLog(
  //   "isObjectEmpty == " + objectName + " " + Object.keys(objectName).length
  // );
  return Object.keys(objectName).length === 0;
}

function objectContainsKey(objectName, keyName) {
  consoleLog(
    "objectContainsKey == " + stringifyObject(objectName) + " keyName=" + keyName
  );
  return keyName in objectName
}

function strEmpty(str) {
  if(str) {
    return false
  } else {
    return true
  }
}

function consoleLog(data) {
  // console.log(data)
  if (env_dev) {
    console.log(data);
  }
}

function logAPIRequest(serviceId, partnerId, headers, body) {
  if(enableLogging) {
    consoleLog("serviceId = " + serviceId + " request info for " + partnerId);
    consoleLog("Headers = " + stringifyObject(headers));
    consoleLog("Body = " + stringifyObject(body));
  }
}

function logStorageInfo(serviceId, partnerId, reqBody) {
  if(enableLogging) {
    consoleLog("serviceId = " + serviceId + " storage info for " + partnerId);
    consoleLog("Body = " + stringifyObject(reqBody));
  }
}

module.exports = {
  stringifyObject,
  parseObject,
  consoleLog,
  isObjectEmpty,
  logAPIRequest,
  logStorageInfo,
  strEmpty,
  objectContainsKey
};
