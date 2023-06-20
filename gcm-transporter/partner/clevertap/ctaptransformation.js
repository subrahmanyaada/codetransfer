const { ctapTransformFreeformMessagePayload } = require('./ctapfreeformTransformation')
const { ctapTransformTemplateMessagePayload } = require("./ctaptemplateTransformation");
const { validateCleverTapTemplatePayload, validateCleverTapFreeformPayload } = require('./payloadValidation');

//Super function to transform the CleverTap payload to BMP payload
function transform(payload, config) {
    //checking whether the payload is of template message or freeform message
    if (payload.isTemplate) {

        const isValidate = validateCleverTapTemplatePayload(payload);

        if(isValidate){
            const transformedData = ctapTransformTemplateMessagePayload(payload, config)
            return transformedData;
    
        }
        else{
            throw new Error("Required fields are not there")
        }
        //calling the function to transform the template message paylaod
      
        //Explicit checking - check error in else part
    } else {
        const isValidate = validateCleverTapFreeformPayload(payload)
        if(isValidate){
        //calling the function to transform the freeform message paylaod
        const transformedData = ctapTransformFreeformMessagePayload(payload, config)
        return transformedData;
        }
        else{
            throw new Error("Required fields are not there")
        }

    }
}

module.exports = { transform }