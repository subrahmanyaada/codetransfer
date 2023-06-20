const redis = require('redis');

const {redisServer}=require('../config')


const client = redis.createClient({
  host:redisServer.host , 
  port: redisServer.port,
});


client.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});


async function storeToRedis(key,value){
    client.set(key, value, (err, reply) => {
      if (err) {
        console.error('Error While Storing Schema To Redis', err);
    
      } else {
        console.log('Schema Stored Successfully:', reply);
      }
    });
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
module.exports = {
    storeToRedis,getDataFromRedis
    };