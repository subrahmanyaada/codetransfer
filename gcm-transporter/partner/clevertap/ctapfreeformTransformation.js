// const {config} = require("../../serviceconfig");

const getTransformedPayloadForFreeFormMessage = {
    freeFormImage: function (payload, bmpFreeformImageUrl) {
        const schema = {
            data: {
                file: payload.image.mediaURL,
                from: payload.wabaNumber,
                to: payload.to,
                mediaType: payload.type,
                text: payload.image.caption
            },
            url: bmpImageUrl, // config.bmp.freeFormImage,
            contentType: "multipart/form-data"
        }
        return schema
    },

    freeFormText: function (payload, bmpPlatform, bmpFreeformTextUrl, bmpContentType) {
        const schema = {
            data: {
                platform: bmpPlatform, // config.platform,
                from: payload.wabaNumber,
                to: payload.to,
                type: payload.type,
                text: payload.text.body
            },
            url: bmpFreeformTextUrl, // config.bmp.freeFormText
           
            contentType: bmpContentType // config.header['Conternt-Type']
        }
        return schema
    }
}

//Sub function to transform the CleverTap payload of Freeform Message to BMP
function ctapTransformFreeformMessagePayload(payload, config) {
    let transformedData = {}
    if (payload.type == 'image') {
        transformedData = getTransformedPayloadForFreeFormMessage.freeFormImage(payload, config.bmp.urlFreeFormImage)
    } else if (payload.type == 'text') {
        transformedData = getTransformedPayloadForFreeFormMessage.freeFormText(payload, config.bmp.platform, config.bmp.urlFreeFormText, config.header['Content-Type'])
    }

    return {
        "Configuration": {
            method: 'post',
            // maxBodyLength: config.maxBodyLength,
            url: transformedData.url,
            headers: {
                'Content-Type': transformedData.contentType,
                'Authorization': config.bmp.bearer 
            },
            data: transformedData.data
        }, "msgId": payload.msgId
    }
}

module.exports = { ctapTransformFreeformMessagePayload }