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
  return "service_" + serviceId + "_config_latest"
}

//Function to store the clevertap payload or the message where message-id as key and payload as value
async function storeBmpAcknowledgement(responseData, partnerMsgId) {
  const dnow = Date.now();
  try {
    consoleLog(`BMP's repsponse id  ${responseData.data[0]}`);

    const responseKey = "r-" + partnerMsgId;
    consoleLog(`Response key ${responseKey}`);
    storeToRedis(responseKey, stringifyObject(responseData));
    //Storing BMP's response id - clevertap id
    storeToRedis(responseData.data[0], partnerMsgId);
    consoleLog(`Time to save in redis ${Date.now() - dnow}`);
  } catch (error) {
    consoleLog(`Error while storing the bmp's acknowledgement ${error}`);
  }
}

// async function getConfig(serviceId) {
//   const configKey = "service_" + serviceId + "_config_latest";

//   const configData = await getDataFromRedis(configKey);
//   console.log(configData);
//   return JSON.parse(configData);
// }

module.exports = { storeBmpAcknowledgement, getConfig, getPartnerConfigKey };
