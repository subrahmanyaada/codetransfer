const redis = require('redis');
const { redisConfig } = require('../serviceconfig');
const { consoleLog, stringifyObject, isObjectEmpty, logStorageInfo, strNotEmpty, objectContainsKey, strEmpty } = require('./tools');

//creating redis client or the connection 
// const client = redis.createClient({
//   host: '127.0.0.1',
//   // host: 'redis',
//   port: 6379,
// });
const client = redis.createClient(redisConfig)

//Function to store the data in redis
async function storeToRedis(key, value) {
  consoleLog("storeToRedis ==> key="+key+" value="+value)
  client.set(key, value, (err, reply) => {
    if (err) {
      throw new Error("storeToRedis error = "+err)
      // consoleLog(`Error While Storing Schema To Redis ${err}`)
    } else {
      consoleLog(`storeToRedis successful ${reply}`);
    }
  });
}

async function getDataFromRedis(key) {
  // consoleLog(key)
  if(isObjectEmpty(key)) {
    throw new Error("Invalid key for redis query")
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

async function getConfig(serviceId, partnerId){
  const configKey = await getPartnerConfigKey(serviceId, partnerId)
  consoleLog(configKey)
  const configData = await getDataFromRedis(configKey)
  consoleLog("value from store = "+configData)
  if(!configData) {
    throw new Error(
      "Info not present in redis for key=" +
        stringifyObject(configKey) + " cannot proceed"
    );
  }
  return JSON.parse(configData)
}

async function getPartnerConfigKey(serviceId, partnerId) {
  return "service_"+serviceId+"_"+partnerId+"_config_latest"
}

//Function to store the clevertap payload or the message where message-id as key and payload as value
async function storeRawMessage(serviceId, partnerId, reqBody) {
  logStorageInfo(serviceId, partnerId, reqBody)
  const strMsgId = 'msgId'

  if(strEmpty(serviceId) || strEmpty(partnerId) || isObjectEmpty(reqBody) || !objectContainsKey(reqBody, strMsgId)) {
    throw new Error("error storing data to redis")
  }
  const dnow = Date.now()

  const keyName = partnerId + '-' + reqBody[strMsgId] ;
  const payloadString = stringifyObject(reqBody)
  storeToRedis(keyName, payloadString)

  consoleLog(`Time to save in redis ${Date.now() - dnow}`)
}


module.exports = { storeRawMessage , storeToRedis, getConfig, getPartnerConfigKey }