const { ctapTransformFreeformMessagePayload } = require('./ctapfreeformTransformation')
const { ctapTransformTemplateMessagePayload } = require("./ctaptemplateTransformation")

//Super function to transform the CleverTap payload to BMP payload
function transform(payload, config) {
    //checking whether the payload is of template message or freeform message
    if (payload.isTemplate) {
        //calling the function to transform the template message paylaod
        const transformedData = ctapTransformTemplateMessagePayload(payload, config)
        return transformedData;

        //Explicit checking - check error in else part
    } else {
        //calling the function to transform the freeform message paylaod
        const transformedData = ctapTransformFreeformMessagePayload(payload, config)
        return transformedData;
    }
}

module.exports = { transform }