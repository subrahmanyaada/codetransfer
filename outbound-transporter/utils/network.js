const axios = require('axios')

const apiRequest = async (data) => {
    try{
        const responseData = await axios.request(data)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          return "Invalid credentials"
        });
    
        return responseData
    }
    catch{
        return "Axios Error"
    }

}

module.exports = {apiRequest}