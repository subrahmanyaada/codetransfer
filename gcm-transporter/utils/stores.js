const redis = require("redis");
const { redisConfig } = require("../serviceconfig");
const { consoleLog, isObjectEmpty, stringifyObject } = require("./tools");

const client = redis.createClient(redisConfig);

//Function to store the data in redis
async function storeToRedis(key, value) {
  consoleLog("storeToRedis ==> key=" + key + " value=" + value);
  client.set(key, value, (err, reply) => {
    if (err) {
      throw new Error("storeToRedis error = " + err);
      // consoleLog(`Error While Storing Schema To Redis ${err}`)
    } else {
      consoleLog(`storeToRedis successful ${reply}`);
    }
  });
}

async function getDataFromRedis(key) {
  // consoleLog(key)
  if (isObjectEmpty(key)) {
    throw new Error("Invalid key for redis query");
  }
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

async function getConfig(serviceId, partnerId) {
  const configKey = await getPartnerConfigKey(serviceId, partnerId);
  consoleLog(configKey);
  const configData = await getDataFromRedis(configKey);
  consoleLog("value from store = "+configData);
  if(!configData) {
    throw new Error(
      "Info not present in redis for key=" +
        stringifyObject(configKey) + " cannot proceed"
    );
  }
  return JSON.parse(configData);
}

async function getPartnerConfigKey(serviceId, partnerId) {
  return "service_" + serviceId + "_" + partnerId + "_config_latest";
}

//Function to store the transformed message into redis
async function storeTransformedMessage(partnerId, transformedMessage) {
  const msgId = "t-" + partnerId + "-" + transformedMessage["msgId"];
  consoleLog(`Transformed key ${msgId}`);
  const payloadString = JSON.stringify(transformedMessage.Configuration.data);
  storeToRedis(msgId, payloadString);
}

module.exports = { storeTransformedMessage, getConfig, getPartnerConfigKey };
