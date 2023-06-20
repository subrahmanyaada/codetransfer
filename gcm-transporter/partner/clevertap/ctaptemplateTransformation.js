const {config} = require("../../serviceconfig");

const getTransformedPayloadForTemplateMessage = {
    templateText: function (payload) {
        const bodyComponent = payload.components.find(
            (component) => component.type === 'body'
        )
        const schema = {
            data: {
                platform: config.platform,
                from: payload['wabaNumber'],
                to: payload['to'],
                type: 'template',
                templateName: payload['template']['namespace'],
                templateLang: payload['template']['languageCode'],
                templateData: bodyComponent.body.parameters.map(
                    (parameter) => parameter.text
                ),
                channel: config.channel,
                tag1: payload.msgId
            },

            url: config.bmp.templateText,
            contentType: config.header['Conternt-Type']
        }
        return schema
    },
    
    templateHeader: function (payload, headerDetails) {
        const bodyComponent = payload.components.find(
            (component) => component.type === 'body'
        )
        const schema = {
            data: {
                platform: config.platform,
                from: payload['wabaNumber'],
                to: payload['to'],
                type: 'template',
                templateName: payload['template']['namespace'],
                templateLang: payload['template']['languageCode'],
                templateData: bodyComponent.body.parameters.map(
                    (parameter) => parameter.text
                ),
                headerType: headerDetails.header.type,
                header: headerDetails.header.file.mediaURL
            },
            url: config.bmp.templateHeader,
            contentType: config.header.contentType
        }
        return schema
    }
}

//Sub function to transform the CleverTap payload of Template Message to BMP
function ctapTransformTemplateMessagePayload(payload, config) {
    //Transforming the data using payload directly without using mapping model because of the array type data
    let transformedData = {}
    if (payload.components.length == 1) {
        transformedData = getTransformedPayloadForTemplateMessage.templateText(payload)
    } else {
        const hasHeader = payload.components.find(
            (component) => component.type === 'header'
        )
        if (hasHeader) {
            transformedData = getTransformedPayloadForTemplateMessage.templateHeader(payload, hasHeader)
        }
    }
    return {
        "Configuration": {
            method: 'post',
            maxBodyLength: config.header.maxBodyLength,
            url: transformedData.url,
            headers: {
                'Content-Type': transformedData.contentType,
                'Authorization': config.bmp.authorizationToken
            },
            data: transformedData.data
        }, "msgId": payload.msgId
    }
}

module.exports = { ctapTransformTemplateMessagePayload }