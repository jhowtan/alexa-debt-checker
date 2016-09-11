/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.4369737d-b664-4ac9-90d1-239709b6f349"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var Intents = require('./Intents');

var DebtChecker = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DebtChecker.prototype = Object.create(AlexaSkill.prototype);
DebtChecker.prototype.constructor = DebtChecker;

DebtChecker.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("DebtChecker onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

DebtChecker.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("DebtChecker onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Owe money, pay money!";
    var repromptText = "Owe money, pay money!";
    response.ask(speechOutput, repromptText);
};

DebtChecker.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("DebtChecker onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

// register custom intent handlers
DebtChecker.prototype.intentHandlers = {
    "ListDebtsIntent": function(intent, session, response) {
        Intents.listDebts(intent, session, response);
    },
    "GetDebtsFromIntent": function (intent, session, response) {
        Intents.getDebts(intent, session, response);
    },
    "PayDebtsIntent": function (intent, session, response) {
        Intents.payDebts(intent, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        Intents.help(response);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the DebtChecker skill.
    var debtChecker = new DebtChecker();
    debtChecker.execute(event, context);
};

