const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// ordering is important
// const { apiRequest } = require("./utils/network");
const {
  partnerIdClevertap,
  serviceId,
  partnerIdMoengage,
  rabbitMQConfig,
} = require("./serviceconfig");
const {
  stringifyObject,
  consoleLog,
  printRequest,
  logAPIRequest,
} = require("./utils/tools");

const Producer = require("./producer");
const producer = new Producer();
const {
    storeRawMessage,
  getValueFromRedis,
  getConfig,
  storeToRedis,
  getPartnerConfigKey,
} = require("./utils/stores");

const { handleErrorForCtap } = require("./partner/clevertap/error");
const { handleErrorForMoengage } = require("./partner/moengage/error");
const { authReqForCtap } = require("./partner/clevertap/auth");
const {
  validatePartnerConfigForCtap,
} = require("./partner/clevertap/validation");
const { createMessagePayloadForCtap } = require("./partner/clevertap/wrapper");

const PORT = 3000;
app.use(bodyParser.json("application/json"));

//API for the testing purpose
// app.get("/test", async (req, res) => {

//     const msg = JSON.stringify({
//         "payloadVersion": 0.1,
//         "to": "628116823073",
//         "msg_id": "25596363|1639561857|20220227|25596363",
//         "wabaNumber": "6282124537231",
//         "type": "text",
//         "isTemplate": false,
//         "text": {
//             "body": "Freeform message with only text"
//         }
//     })

//     await producer.publishMessage("Info", msg);
//     res.send();
// });

//API to get cleverTap message and publish the same into RabbitMQ
//TBD - apikey & payload - partner_id
app.post("/v1/messages/ctap/sendmessage", async (req, res) => {
  consoleLog("end-point invoked for clevertap ");

  const partnerId = partnerIdClevertap;
  const sId = serviceId;

  const rHeaders = req.headers;
  const rBody = req.body;
  logAPIRequest(sId, partnerId, rHeaders, rBody);

  try {
    const configObj = await getConfig(sId, partnerId);

    const configData = configObj.config;
    const requestData = rBody;

    await authReqForCtap(
      configData.bmp.userLogin,
      configData.header,
      requestData.credentials
    );
    validatePartnerConfigForCtap(configData);
    // TODO optimise later
    await storeRawMessage(sId, partnerId, requestData);
    const partnerPayload = createMessagePayloadForCtap(
        configData,
        requestData
    );
    await producer.publishMessage(serviceId, partnerId, partnerPayload);
  } catch (exception) {
    consoleLog("Error = " + exception);
    handleError(partnerId, exception);
  }

  res.send();
});

//API for the UCW integration
app.post("/v1/messages/ucw/sendmessage", async (req, res) => {
  const requestData = req.body;
  requestData["tenant_id"] = "ucw";
  await producer.publishMessage("Info", JSON.stringify(requestData));
  res.send();
});

app.post("/v1/messages/moe/sendmessage", async (req, res) => {
  const configData = await getConfig("collector", config.partnerIdMoengage);
  // loadConfiguration(configData.config)
  const requestData = req.body;

  //TODO: User authentication if present

  // const isUserValidate = await authAPI()
  // consoleLog(isUserValidate)
  // if (isUserValidate) {
  //     //Publish message of producer is called to publish the queue
  //     const partnerId = config.partnerId
  //     const partnerQName = config.partnerQName
  //     const partnerRoutingKey = config.partnerRoutingKey
  //     const partnerMessage = config.partnerMessage
  //     const tenantId = config.tenantId
  //     const header = config.header
  //     const dateTime = Date.now()

  //     storeMsgIntoRedis(partnerId, requestData)

  //     const partnerPayload = {
  //         partnerId: partnerId,
  //         partnerPayload: requestData,
  //         tenantId: tenantId,
  //         header: header,
  //         partnerMessage: partnerMessage,
  //         dateTime: dateTime,
  //         partnerQName: partnerQName,
  //         partnerRoutingKey: partnerRoutingKey
  //     };

  //     await producer.publishMessage(partnerId, partnerQName,
  //         partnerRoutingKey, partnerPayload, partnerMessage);

  // }

  res.send();
});

function handleError(partnerId, exception) {
  if (partnerId === partnerIdClevertap) {
    handleErrorForCtap(exception);
  } else if (partnerId === partnerIdMoengage) {
    handleErrorForMoengage(exception);
  } else {
    consoleLog("No partner found to handleError");
  }
}

function initServiceDependencies() {
  producer.createChannel(rabbitMQConfig);
}

app.listen(PORT, async () => {
  initServiceDependencies();
  console.log(`GCM collector listening at ${PORT}`);
});



//////// TO BE REMOVED LATER
// app.post("/v1/messages/ctap/sendmessage", async (req, res) => {
//     consoleLog("end-point invoked for clevertap ");
  
//     const partnerId = partnerIdClevertap;
//     const sId = serviceId;
  
//     const rHeaders = req.headers;
//     const rBody = req.body;
//     logAPIRequest(sId, partnerId, rHeaders, rBody);
  
//     try {
//       const configObj = await getConfig(sId, partnerId);
  
//       consoleLog("server -> config = " + stringifyObject(configObj));
  
//       if (configObj) {
//         // loadConfiguration(configData.config)
  
//         const configData = configObj.config;
  
//         const requestData = rBody;
//         const validAPI = await authReqForCtap(
//           configData.gcmUrls.userLogin,
//           configData.header,
//           requestData.credentials
//         );
//         // const isUserValidate = await apiRequest({
//         //     method: 'post',
//         //     url: configData.gcmUrls.userLogin,
//         //     headers: configData.header,
//         //     data: requestData.credentials
//         // })
  
//         consoleLog("validAPI = " + validAPI);
  
//         if (validAPI) {
//           validatePartnerConfigForCtap(configData);
  
//           storeMsgIntoRedis(sId, partnerId, requestData);
  
//           const partnerPayload = createMessagePayloadForCtap(
//             configData,
//             requestData
//           );
  
//           // const partnerPayload = {
//           //   partnerId: partnerId,
//           //   partnerPayload: requestData,
//           //   tenantId: tenantId,
//           //   header: header,
//           //   partnerMessage: partnerMessage,
//           //   dateTime: dateTime,
//           //   partnerQName: partnerQName,
//           //   partnerRoutingKey: partnerRoutingKey,
//           // };
  
//           await producer.publishMessage(serviceId, partnerId, partnerPayload);
//         } else {
//           throw new Error("auth failured for ctap req");
//         }
//       } else {
//         throw new Error(
//           "Info not present in redis for key=" +
//             getPartnerConfigKey(configData.serviceId, partnerId)
//         );
//       }
//     } catch (exception) {
//       consoleLog("Error = " + exception);
//       handleError(partnerId, exception);
//     }
  
//     res.send();
//   });
//////// ENDS