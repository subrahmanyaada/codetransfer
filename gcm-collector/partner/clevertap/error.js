const { consoleLog } = require("../../utils/tools")

async function handleErrorForCtap(exception) {
    console.log(`exception ${exception}`)
    consoleLog("TODO return failure 1009 callback for clevertap")
}

module.exports = { handleErrorForCtap}