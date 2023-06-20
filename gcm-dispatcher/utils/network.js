const axios = require('axios');
const { consoleLog, stringifyObject } = require('./tools');

const apiRequest = async (data) => {
    try{
        consoleLog("apiRequest = "+stringifyObject(data))
        const responseData = await axios.request(data)
        .then((response) => {
          return response.data
        }).catch((error) => {
          throw new Error("api response error = "+error) 
        });
        return responseData
    } catch (exception) {
      throw new Error("api error = "+exception) 
    }
}

module.exports = {apiRequest}