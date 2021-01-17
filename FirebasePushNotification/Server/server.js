"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const EventEmitter = require('events').EventEmitter;
const FCM = require('fcm-push');

const ALPHA_VANTAGE_API_KEY = 'EXKNMOOUTJ53YDU2'
const FCM_SERVER_KEY = 'AAAAOUoA3z0:APA91bE75gGtdW2IoMKCw3cQL5mpB1WSpgFoX7PM4sfvoOk1X1_-uaibuJheynNpAxT3JczNtHxbQphyLSqGHZypcynlyomFB7J2iomfuYTaNABnxVmX1nPOUsAEf2kIt26lYL61WbKR';
const app = express();
app.use(bodyParser.json());

/*--------------------------------user's subscription to topic--------------------------*/
let fcm = new FCM(FCM_SERVER_KEY);
// These registration tokens come from the client FCM SDKs.
let registrationTokens = [];
  
  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  admin.messaging().subscribeToTopic(registrationTokens, topic)
	.then(function(response) {
	  // See the MessagingTopicManagementResponse reference documentation
	  // for the contents of response.
	  console.log('Successfully subscribed to topic:', response);
	})
	.catch(function(error) {
	  console.log('Error subscribing to topic:', error);
	});

//an extend to EventEmmiter in order to run every 15 seconds
class EachFifteenSec extends EventEmitter{
	start(){
		this._id = setInterval(this.emit.bind(this,'fifteenSec'), 15000);
	}
}

//get the required company's stock price and trigger a push notification
function priceNotification(url){
	https.get(url, function(res){
		var body = '';

		res.on('data', function(chunk){
			body += chunk;
		});

		res.on('end', function(){
			var fbResponse = JSON.parse(body);
			var price = fbResponse["Global Quote"]["05. price"] + " $";
			console.log("Got a response: ", price);
		});
	}).on('error', function(e){
		console.log("Got an error: ", e);
	});
}

/* get the required symbol from app (/symbol?sym=xxx), make a proper request url to alphavantage
and run priceNotification every 15 sec */
app.get('/symbol', (req, res) => {

	var symbol = req.query.sym;
	var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
	
	let e = new EachFifteenSec();
	e.on('fifteenSec', function(){
		priceNotification(url)
	});
	e.start();
});

//------------------ post back to firebase ------------------------

app.post('/:user/token', (req, res, next) => {
    let token = req.body.token;
    console.log(`Received save token request from ${req.params.user} for token=${token}`);

    if (!token) return res.status(400).json({err: "missing token"});

    tokens[req.params.user] = token;
    res.status(200).json({msg: "saved ok"});
});

app.post('/:user/message', (req, res, next) => {
    let message = req.body.message;
    console.log(`Going to send message to ${req.params.user} message=${message}`);

    if (!message) return res.status(400).json({err: "missing message"});

    let targetToken = tokens[req.params.user];
    if (!targetToken) return res.status(404).json({err: `no token for user ${req.params.user}`});

    fcm.send({
        to: targetToken,
        data: {
            someKey: "some value"
        },
        notification: {
            title: "message title",
            body: message
        }
    }, (err, response) => {
        if (err) return res.status(500).json({err: `message sending failed - ${err}`});
        return res.status(200).json({msg: "sent ok"});
    });
});

app.get('/tokens', (req, res, next) => {
    res.status(200).json(tokens);
});

app.listen(PORT, () => {
	console.log(`App is listening at http://localhost:${PORT}`)
  });