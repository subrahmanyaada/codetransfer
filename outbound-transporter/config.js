class Config {
  constructor() {
  }
  storeConfigData(data){
    this.consumerId = data.consumerId;
    this.partnerId = data.partnerId;
    this.rabbitMQ = data.rabbitMQ;
    this.ctap = data.ctap;
    this.bmp = data.bmp;
    this.redis = data.redis;
    this.ctapConsumeQ = data.ctapConsumeQ;
    this.dispatchQ = data.dispatchQ;
    this.env_prod = data.env_prod;
    this.env_dev = data.env_dev;
  }
}

module.exports = Config;