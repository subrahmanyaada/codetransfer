const { apiRequest } = require("../../utils/network")
const { consoleLog } = require("../../utils/tools")

async function authReqForCtap(url, header, credentials) {
    consoleLog("authReqForCtap -> url = "+url+" header="+header+" credentials="+credentials)
    // let isValid = await apiRequest({
    //     method: 'post',
    //     url: url,
    //     headers: header,
    //     data: credentials
    // })

    // TODO Bypass for now
    const isValid = true
    consoleLog("API validation result="+isValid)
    if(!isValid) {
        throw new Error("Invalid API request auth failed")
    }

    return isValid
}

module.exports = { authReqForCtap }