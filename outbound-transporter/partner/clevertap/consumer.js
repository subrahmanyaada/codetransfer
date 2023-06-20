const { loadConfiguration } = require("../../serviceconfig");
const { getConfig } = require("../../utils/stores");
const { consumeBmpCtapMessages } = require("./bmpctapconsumer");

// Consume class to consume the CleverTap message/payload and transform it as per the BMP request
class Consume {
  constructor(channel) {
    this.channel = channel;
  }

  async consumeMethod() {
    const configData = await getConfig('outbound-transporter','ctap')
    loadConfiguration(configData.config)
    await consumeBmpCtapMessages(this.channel);
  }
}

module.exports = Consume;
