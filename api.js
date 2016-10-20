var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var querystring = require('querystring');

var app = express();
var jsonParser = bodyParser.json({ type: 'application/json' });

var minRange = 1;
var maxRange = 1000;

//Predefining some error messages
var errNotAppJson = {error:"Content-Type is not 'application/json'. Please send a valid Content-Type header."};
var errEmptyBody = {error:"Did you send something?"};
var errNotArray = {error:"The input is not an array"};
var errInvalidData = {error:"Looks like the data isn't a valid JSON object"};

app.set('port', (process.env.PORT || 8081));

app.post('/sort', jsonParser, function (req, res) {
  if (!(req.is('application/json')||req.is('application/json; charset=utf-8'))) return res.status(415).json(errNotAppJson);
  if (!req.body.length) return res.status(400).json(errEmptyBody);

  var payload = req.body;
  console.log('Body: ' + JSON.stringify(payload));

  if (Array.isArray(payload)){
    //looks good, lets sort this payload
    var sorted = insertionSort(payload);
    console.log('Sorted: ' + sorted);
    res.json(sorted);
    //Send a message to yours truly so I know someone hit this API
    sendNotificationTwilio(req.ip,sorted);
  }
  else {
    res.json(errNotArray);
  }
});

app.listen(app.get('port'), function () {
  console.log('API started on port: ' + app.get('port'));
});


//Core Logic
function insertionSort(payload) {
    var len = payload.length;
    for (var i = 0; i < len; i++) {

      //is data an Number?
      if(!Number.isInteger(payload[i])) throw {name : "Invalid data", message : "Wasn't expecting a non-Integer in the array. (" + payload[i].toString() + ")"};
      //is data within range?
      if(payload[i] < minRange || payload[i] > maxRange) throw {name : "Invalid data", message : "One of the number out of range (" + payload[i].toString() + "). We only accept " + minRange + "-" + maxRange};

      var tmp = payload[i];
      for (var j = i - 1; j >= 0 && (payload[j] > tmp); j--) {
        payload[j + 1] = payload[j];
      }
      payload[j + 1] = tmp;
    }
    return payload;
}

function sendNotificationTwilio(ip,sorted) {

  //create the SMS message payload
  var postData = querystring.stringify({
    'From' : '+12565307073',
    'To' : '+6593625120',
    'Body' : 'Someone from IP[' + ip + '] sorted ' + sorted
  });

  //setup the Post request
  var postOptions = {
      host: 'api.twilio.com',
      port: '443',
      path: '/2010-04-01/Accounts/ACad5dfb32d80b91028547f0569ffcb469/Messages.json',
      method: 'POST',
      auth: 'ACad5dfb32d80b91028547f0569ffcb469:e463850ff3c5cb344d5be2f69cd87c12',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
      }
  };

  var twilioReq = https.request(postOptions, function(twilioRes) {
    twilioRes.setEncoding('utf8');
    twilioRes.on('data', function(chunk) {
      console.log('Twilio Response: ' + chunk);
    });
  });

  //send the post to Twilio!
  twilioReq.write(postData);
  twilioReq.end();

}

//Error Handling
app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  if(err.name == 'SyntaxError'){
    res.status(500).send(errInvalidData);
  }
  else if(err.name == 'Invalid data'){
      res.status(500).send({error: err.message});
  }
  else res.status(500).send({error:"Cannot Compute...",details:"[" + err.name + "] " + err.message});
}
