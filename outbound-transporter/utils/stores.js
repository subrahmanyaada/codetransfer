const redis = require('redis');
const { stringifyObject, consoleLog } = require('./tools');
const {config} = require("../serviceconfig")

// Create a Redis client
const client = redis.createClient({
  host: '127.0.0.1',
  // host: 'redis',
  port: 6379,
});

//Function to store the data into redis
async function storeToRedis(key,value){
client.set(key, value, (err, reply) => {
  if (err) {
    consoleLog(`Error While Storing Schema To Redis ${err}`);
  } else {
    consoleLog(`Schema Stored Successfully: ${reply}`);
  }
});
}

//Function to get the value from the redis
function getValueFromRedis(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (error, result) => {
      if (error) {
        consoleLog(`Error:  ${error}`);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

//Function to get the partner message id from the redis using bmp message id
async function getPartnerMsgIdFromRedis(key) {
  try {
    const partnerId = await getValueFromRedis(key);
    return partnerId;
  } catch (error) {
    consoleLog(`Error:  ${error}`);
    return null;
  }
}


async function getDataFromRedis(key) {
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


async function getConfig(serviceId,partnerId){
 const configKey="service_"+serviceId+"_"+partnerId+"_config_latest"
 
 const configData=await getDataFromRedis(configKey)
console.log(configData)
  return JSON.parse(configData)

  }


//Function to store the transformed message into redis
async function storeTransformedMessage(key, transformedMessage){
  const msgId = key;
  const payloadString= stringifyObject(transformedMessage.Configuration.data);
  storeToRedis(msgId,payloadString)
}

module.exports = {storeTransformedMessage, getPartnerMsgIdFromRedis, getConfig}
