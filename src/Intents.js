var https = require('https');
var AlexaSkill = require('./AlexaSkill');
var cookie = '';

var userHash = {
  "justin": 3152186,
  "amit": 3177017
};

var ListDebtsIntent = function(intent, session, response) {
  var sessionAttributes = {};
  function getDebtList(eventCallback) {
    var options = {
        host: 'secure.splitwise.com',
        path: '/api/v3.0/get_friends/',
        headers: {
          accept: '*/*',
          cookie: cookie
        }
      };

    https.get(options, function(res) {
        var body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          var allFriends = JSON.parse(body).friends;
          var friendsOwed = allFriends.filter(function (friend) {
            if (friend.balance[0]) {
              var amount = friend.balance[0].amount;
              if (amount && amount !== 0) {
                return (amount.substring(0,1) === '-');
              }
              return false;
            }
            return false;
          });
          friendsOwed.forEach(function(friend) {
            userHash[friend.first_name.toLowerCase()] = friend.id;
          });
          eventCallback();
        });

      }).on('error', function (e) {
        console.log("Got error: ", e);
    });
  }

  getDebtList(function() {
    var names = Object.keys(userHash);
    var lastName = names.pop();
    names = names.join(', ');
    names = names + ' and ' + lastName;
    var speech = "You currently owe " + names + " some money.";

    sessionAttributes.users = userHash;
    session.attributes = sessionAttributes;

    var speechOutput = {
      speech: speech,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
      speech: "Try asking: How much do I owe Justin?",
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    }
    response.ask(speechOutput, repromptOutput);
  });

};

var GetDebtsFromIntent = function(intent, session, response) {
  var sessionAttributes = session.attributes;
  var payeeList = sessionAttributes.users;
  var userId = payeeList[intent.slots.name.value.toLowerCase()];
  console.log(intent.slots.name.value, userId);

  function getBalanceFrom(userId, eventCallback) {
    // var url = getFriend + userId;
    var options = {
      host: 'secure.splitwise.com',
      path: '/api/v3.0/get_friend/' + userId,
      headers: {
        accept: '*/*',
        cookie: ''
      }
    };

    https.get(options, function(res) {
      var balance;
      res.on('data', function (chunk) {
        balance = JSON.parse(chunk).friend.balance[0].amount;
      });

      res.on('end', function () {
        eventCallback(parseToSpeech(balance));
      });

    }).on('error', function (e) {
      console.log("Got error: ", e);
    });
  };

  var parseToSpeech = function (balance) {
    var dollars = '';
    var cents = '';
    if (isNaN(parseInt(balance.substring(0,1)))) {
      balance = balance.substring(1);
      dollars = balance.split('.')[0];
      cents = balance.split('.')[1];
      var spokenValue = "<say-as interpret-as='cardinal'>" + dollars.toString() + " dollars and " + cents.toString() + " cents" + "</say-as>";
      return "<speak>You currently owe " + intent.slots.name.value + ", " + spokenValue + "</speak>";
    } else {
      dollars = balance.split('.')[0];
      cents = balance.split('.')[1];
      var spokenValue = "<say-as interpret-as='cardinal'>" + dollars.toString() + " dollars and " + cents.toString() + " cents" + "</say-as>";
      return "<speak>Actually, " + intent.slots.name.value + " owes you " + spokenValue + "</speak>";
    }
  };

  getBalanceFrom(userId, function(parsedSpeech) {
    var speechOutput = {
      speech: parsedSpeech,
      type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
      speech:  "What would you like to do?",
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Outstanding Debt", parsedSpeech);
  });

};

var PayDebtsIntent = function(intent, response) {
  response.tell("Pay Debts");
};

var HelpIntent = function(response) {
  response.tell("Try asking: outstanding payments");
};

module.exports = {
  "listDebts": ListDebtsIntent,
  "getDebts": GetDebtsFromIntent,
  "payDebts": PayDebtsIntent,
  "help": HelpIntent
};
