var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json({ type: 'application/json' });

var minRange = 1;
var maxRange = 1000;

//Predefining some error messages
var errNotJson = {error:"The POST request body is not application/json type"};
var errEmptyBody = {error:"Did you send something?"};
var errNotArray = {error:"The input is not an array"};
var errInvalidData = {error:"Looks like the data isn't a valid JSON object"};

app.post('/sort', jsonParser, function (req, res) {
  if (!req.is('application/json')) return res.status(415).json(errNotJson);
  if (!req.body.length) return res.status(400).json(errEmptyBody);

  var payload = req.body;
  console.log('Body: ' + JSON.stringify(payload));

  if (Array.isArray(payload)){
    var sorted = insertionSort(payload);
    console.log('Sorted: ' + sorted);
    res.json(sorted);
  }
  else {
    res.json(errNotArray);
  }
});

app.listen(8081, function () {
  console.log('API started on port 8081!');
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
