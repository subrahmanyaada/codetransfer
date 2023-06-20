const { config } = require("../serviceconfig")

function stringifyObject(obj) {
    return JSON.stringify(obj)
}

function parseObject(obj) {
    return JSON.parse(obj)
}

function consoleLog(data){
   if(config.env_dev){
     return console.log(data)
   }
}

function objectNotEmpty(data){
  return true
}

module.exports = {stringifyObject,parseObject, objectNotEmpty, consoleLog}