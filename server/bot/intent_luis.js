//  Detects an intent using LUIS given a sentence. 
const axios = require('axios');

// CHANGE THIS TO YOUR AZURE URL
var LUIS_URL = `https://luis-ai-ml-course.cognitiveservices.azure.com/luis/prediction/v3.0/apps/eefb589e-a80b-4250-b2a0-7c42cf111086/slots/production/predict?subscription-key=27546fc0330341eda6def7d7b7ef6e5f&verbose=true&show-all-intents=true&log=true&query=`;

var getIntentLUIS = async(input) => {
    var fullLUISURL = LUIS_URL + input;
    var LUISResp = await axios.get(fullLUISURL);
    console.log(LUISResp.data);
    return ({
        topIntent: LUISResp.data.prediction.topIntent,
        allIntents: LUISResp.data.prediction.intents,
        entities: LUISResp.data.prediction.entities
    })
}

module.exports = {
    getIntentLUIS: getIntentLUIS
}