const express = require("express");
const semver = require("semver");
const router = express.Router();
const { storeToRedis, getDataFromRedis } = require("../utils/store");

router.post("/", async (req, res) => {
  const payload = req.body;

  try {
    const serviceId = payload.serviceId;
    const config = payload.config;
    const partnerId = payload.partnerId;
    const configKey = payload.configKey;

    // const configKey="service_"+serviceId+"_"+partnerId +"_config_latest"
    console.log(configKey);
    const currentTimeStamp = new Date().getTime();
    const oldConfig = await getDataFromRedis(configKey);

    const version =
      oldConfig == null
        ? "1.0.0"
        : semver.inc(JSON.parse(oldConfig).version, "patch");

    const configdata = {
      serviceId: serviceId,
      config: config,
      version: version,
      timestamp: currentTimeStamp,
    };
    storeToRedis(configKey, JSON.stringify(configdata));

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
