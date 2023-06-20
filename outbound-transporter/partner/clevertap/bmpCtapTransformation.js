const {config} = require("../../serviceconfig")
const { getPartnerMsgIdFromRedis } = require('../../utils/stores')

const CTapCallbackSuccess = {
    isStatusSent: function (payload) {
        var condition = false;
        if (payload.data.status === "sent") {
            condition = true
        }
        return condition
    },

    statusSentCallback: function (accountNo, partnerMsgId, timestamp) {
        const schema = {
            url: config.ctap.success + accountNo,
            payload: {
                "payloadVersion": "0.1",
                "statuses": [
                    {
                        "msgId": partnerMsgId,
                        "status": "sent",
                        "timestamp": timestamp
                    }
                ]
            }
        }

        return schema
    },

    isStatusDelivered: function (payload) {
        return (payload.data.status === "delivered") ? true : false
    },

    statusDeliveredCallback: function (accountNo, partnerMsgId, timestamp) {
        const schema = {
            url: config.ctap.delivered + accountNo,
            payload: {
                "payloadVersion": "0.1",
                "statuses": [
                    {
                        "msgId": partnerMsgId,
                        "status": "delivered",
                        "timestamp": timestamp
                    }
                ]
            }
        }
        return schema
    },

    isStatusRead: function (payload) {
        return (payload.data.status === "read") ? true : false
    },

    statusReadCallback: function (accountNo, partnerMsgId, timestamp) {
        const schema = {
            url: config.ctap.read + accountNo,
            payload: {
                "payloadVersion": "0.1",
                "statuses": [
                    {
                        "msgId": partnerMsgId,
                        "status": "read",
                        "timestamp": timestamp
                    }
                ]
            }
        }
        return schema
    }
}

CTapCallbackFailure = {

    isStatusFailed: function (payload) {
        return (payload.data.status === "failed") ? true : false
    },

    statusFailedCallback: function (accountNo, partnerMsgId, timestamp, message) {
        const schema = {
            url: config.ctap.failed + accountNo,
            payload: {
                "payloadVersion": "0.1",
                "statuses": [
                    {
                        "msgId": partnerMsgId,
                        "status": "failed",
                        "timestamp": timestamp,
                        "error": {
                            "code": message == "template mismatch" ? 1001 : message == "Invalid credentials" ? 1000 : message == "Invalid phone number" ? 1004 : message == "Too many send requests to phone numbers" ? 1006 : 404,
                            "title": message
                        }
                    }
                ]
            }

        }

        return schema
    }
}

const CtapMessages = {
    // TODO IM / message types
}


async function getPartnerMsgId(bmpMsgId) {
    const partnerId = await getPartnerMsgIdFromRedis(bmpMsgId);
    return partnerId;
}

//Super function to transform the CleverTap payload to BMP payload
async function transform(headers, payload) {
    // check payload based on event type - 
    if (payload.eventType == config.bmp.eventTypeMessageStatusKey) {
        const transformedData = await transformMessageStatusEventType(headers, payload)
        return transformedData;
    } else if (payload.eventType == config.bmp.eventTypeMessageKey) {
        const transformedData = transformMessageEventType(headers, payload)
        return transformedData;
    } else if (payload.eventType == config.bmp.eventTypeConversationKey) {
        const transformedData = transformMessageStatusEventType(headers, payload)
        return transformedData;
    }
}

//Sub function to transform the CleverTap payload of Template Message to BMP
async function transformMessageStatusEventType(headers, payload) {

    let mappingModel = {}
    let partnerCallbackUrl = ""
    var partnerMsgId = ""

    //console.log("out trans transformMessageStatusEventType payload=" + JSON.stringify(payload))

    if (CTapCallbackSuccess.isStatusSent(payload)) {
        partnerMsgId = await getPartnerMsgId(payload.data.id)
        mappingModel = CTapCallbackSuccess.statusSentCallback(payload.accountNo, partnerMsgId, payload.data.timestamp)
        partnerCallbackUrl = CTapCallbackSuccess.statusSentCallback().url
    }
    else if (CTapCallbackSuccess.isStatusDelivered(payload)) {
        partnerMsgId = await getPartnerMsgId(payload.data.id)
        mappingModel = CTapCallbackSuccess.statusDeliveredCallback()
        partnerCallbackUrl = CTapCallbackSuccess.statusDeliveredCallback().url
    }
    else if (CTapCallbackSuccess.isStatusRead(payload)) {
        partnerMsgId = await getPartnerMsgId(payload.data.id)
        mappingModel = CTapCallbackSuccess.statusReadCallback()
        partnerCallbackUrl = CTapCallbackSuccess.statusReadCallback().url
    }
    else if (CTapCallbackFailure.isStatusFailed(payload)) {
        partnerMsgId = await getPartnerMsgId(payload.data.id);
        mappingModel = CTapCallbackFailure.statusFailedCallback(payload.accountNo, partnerMsgId, payload.data.timestamp, payload.data.message)
        partnerCallbackUrl = CTapCallbackFailure.statusFailedCallback().url
    }
    else {
        // TODO throw error
        // throw new Error('Error at transformMessageStatusEventType function');

    }

    const payloadHeaders = headers

    return {
        "Configuration": {
            method: 'post',
            url: partnerCallbackUrl,
            headers: {
                'Content-Type': payloadHeaders.contentType,
                'Authorization': payloadHeaders.bearer
            },
            data: mappingModel
        },
        "msgId": partnerMsgId
    }
}

function transformMessageEventType(headers, payload) {
    // TODO 
    return {}
}

function transformConversationEventType(headers, payload) {
    // TODO 
    return {}
}


module.exports = { transform }