const intentDetect = require('./intent_detection.js');
const answerList = require('./knowledge_base.json');
var _ = require('lodash');

var getBotResponse = async(inputToSend) => {

    var fullLUISResponse = await intentDetect.getIntent(inputToSend);
    console.log(fullLUISResponse);
    if (fullLUISResponse === 'null') {
        throw new Error('No results returned.');
    } else {
        var topIntent = fullLUISResponse.topIntent;
        var botAnswer = await getResponseForIntent(answerList, topIntent, fullLUISResponse);
        console.log(botAnswer);
        return (botAnswer);
    }
}

// THIS IS THE MAIN FUNCTION THAT YOU SHOULD MODIFY TO CUSTOMIZE THE RESPONSES...

var getResponseForIntent = async(intentMap, intent, fullLUISResponse) => {
    console.log(intent);
    var returnResult = '';

    // TODO: THIS IS WHERE YOU CAN ADD CUSTOM INTENT HANDLERS
    // I.E. CALL ANOTHER SERVICE, SCREEN SCRAPE, ETC...
    // ADD RPA WORKFLOW HERE IF intent == something_RPA_related

    if (intent == 'general_hello') {
        returnResult = 'Hello! This is from a special intent response.';
    } else if (intent == 'fave_food') {

        // If the user is talking about their favorite food...

        var entitiesFound = (fullLUISResponse.entities && fullLUISResponse.entities.length > 0);

        // First, see if they've mentioned what food is their favorite...

        if (entitiesFound) {
            // Find all entities of type "food" (this code is more robust than it needs to be for this example, since we are only ever expecting food here.)
            var foundfood = _.filter(fullLUISResponse.entities, function(q) {
                return q.type == 'food';
            });
            // Right now, this only selects the first food they mention. This could be extended to support users who mention more than one food.
            var food = foundfood[0].entity;
            console.log(`got food: ${food}`);
            returnResult = `Oh boy, I sure like ${food} too!`
        } else {
            returnResult = `how about you tell me what food you like...`;
        }
    } else {
        // Otherwise we use the standard Q&A mapping from the knowledge_base.json file:
        var foundanswer = _.filter(intentMap.answers, function(q) {
            return q.intent == intent;
        });
        returnResult = foundanswer[0].answer;
    }

    return (returnResult);
}

module.exports = { getBotResponse };