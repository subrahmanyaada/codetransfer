
const Config = require("./config");
const config = new Config();


function loadConfiguration(data) {
   config.storeConfigData(data);
}

module.exports = { loadConfiguration, config}