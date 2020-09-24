//  Detects an intent given a sentence. 
const intentLuis = require('./intent_luis.js');

// this could be modified to use other services for intent detection beyond LUIS
// this lite example defaults to LUIS

var getIntent = async(input) => {
    var LUISResponse = await intentLuis.getIntentLUIS(input);
    return (LUISResponse);
}

module.exports = {
    getIntent
};