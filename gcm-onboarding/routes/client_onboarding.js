
const express = require('express');
const router=express.Router()
const {storeToRedis}= require("../utils/store")

const requiredFields = ['partnerId', 'clientId', 'config'];


router.post("/",(req,res)=>{
  const payload = req.body;

  // Check if all the required keys are present
  const requiredKeys = requiredFields
  const missingKeys = requiredKeys.filter(key => !(key in payload));

  if (missingKeys.length > 0) {
    const errorMessage = "Invalid Request Format: ${missingKeys.join(', ')}";
    return res.status(400).json({ error: errorMessage });
  }

  else{
    try {
      const partnerId = payload.partnerId;
      const clientId = payload.clientId;
      const config = payload.config;

      // Storing Raw message to Redis as it is using the key partnerID_clientId_configuration_latest

      const rawMessageKey = partnerId + "_" + clientId + "_configuration_latest";
      const rawMessage = JSON.stringify(payload);
      storeToRedis(rawMessageKey, rawMessage);

      // Storing endpoints to Redis
      const partner_details = config.find(obj => "partner_endpoint" in obj);
      const callback_details = config.find(obj => "callback_url" in obj);
    
      const partner_endpoint = partner_details?.partner_endpoint;
      const callback_endpoint = callback_details?.callback_url?.[0]?.callback_endpoint;
      const imo_endpoint = callback_details?.callback_url?.[0]?.imo_endpoint;

      // Formatting the keynames
    
      const partner_endpoint_key = partnerId + "_" + clientId + "_partner_endpoint";
      const callback_endpoint_key = partnerId + "_" + clientId + "_callback_endpoint";
      const imo_endpoint_key = partnerId + "_" + clientId + "_imo_endpoint";
    
      storeToRedis(partner_endpoint_key, partner_endpoint);
      storeToRedis(callback_endpoint_key, callback_endpoint);
      storeToRedis(imo_endpoint_key, imo_endpoint);
    
      res.json({ success: true });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}
})
module.exports=router;



