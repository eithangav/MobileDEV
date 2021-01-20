/**
 * This is a server to create app push notification with the current price of a stock
 * that the user of the app wants, every 15 seconds
 */

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const EventEmitter = require('events').EventEmitter;
const admin = require('firebase-admin');

const PORT = 8080;
const ALPHA_VANTAGE_API_KEY = 'EXKNMOOUTJ53YDU2'
const app = express();
app.use(bodyParser.json());

//admin initializer
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'fir-pushnotification-8f6fb',
        clientEmail: 'firebase-adminsdk-p14dw@fir-pushnotification-8f6fb.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkskoQZjp3Guo3\nsj+Q7WmcXihrjD2Udi1Mc+MwGNS6gpvWSwxeD7Ofp1M+t7cz9gWEQPJkq9KivrVK\nH3gN819/Wil/AmLf7As73mSDs3YZDNKHdX/9DVXdOHuiOXd9Ivl7wg59MyFefsva\nw/YM8SU9v2yBxUucsb/T1bmkc1d7KJOnqNzmwQNUp6B4V4Zi4gf+PuGxq8xt/nVD\nC9Sp1TWBzm4Z92IMijy6vpEjC9teDNtC0mhZD6o2WNoEIIreuKkVHgwvvjcjhK3L\nMaV7jfA/gJa7K0Q1xgG26Cdsm+yHHoKapqAaBsMprMdvfZFGKQpLS3B9bBCBQ69C\n632FP+XXAgMBAAECggEAGKTfBUYuwGzEGFJxRY/o6i+Cr9kby8/FJnf+yk8k4cWy\naOXw81A5Kg4hHDTkUn+hQrFvM9YsHhMYUH+V+MxugUFuDSW/ws7wvWQhOT3M0aHE\nDOXtoWFx9DjD8znTIePuXfDjNyPD/f5OJa2F71jUIEG5DFAH6OoGEL4d2bgyomhp\n8XPRRtKL9OrEMgHIFNXf8kPlDWcsoUHt7eEQOzM6JUj+XmTY2K5IFioIOamhpuDI\nDPwTu/l+wX6PZNQuSW+MHTZbmDozqRpKFOJhg05ZpstSsmGODtaWy5v9BWstAj9q\nv60fbM4rjO6HcAYLR/li1w7F3Za9Zwc4k2GxRyK7PQKBgQDWey8T9g+IfNrFB2w7\nufv/PICVB1i759pqM3oP1g6uDtR8+NhupxKy05gzVdPSB3GgRS46b0STkbI/S7pm\nzOqbu5ddx6cFCaY8LbgoVerv0ZAath/zljkDhDhxq7kLPbzuXvfKOmLGhGHg3z09\nfopPTYmeYaKA5Tz1BFyVrM3tswKBgQDEk/nMa+1blUCeEubuBct6WYJ7/HVW+HDJ\nlMIMI7yS8rfaTanm8YfcR3LYI2VLaP/KDZM+lH0h671o/jBp28w13wPzqUsigiJW\npN0BGoT+s+bdbPmoCgDveDJqO9YXJL6a0n7kBkK5EeNK8wvwebEdASKAy27Yikw0\nIGZY30V9TQKBgEvQk12c9vSqHbLT4uBh57/bJSCIzkbtt/keZSE/60R/nYDnfanv\niN6JiR1sU0nEs9eRXLvvJPB86eMR47v+51dRQjo2HsXbGVXgW152sGtBSo0Gn9i8\n2z5w+HrF1s0wb55bF3/2j3/Yv7h7cOxR1JYftGu123lwjtGVTxzhTpGdAoGBALjE\n3ebnCxMqFrJ90dGoYLl/qMYhZal5m4nd6QbAEF+PBICMv0XzgF/sSGYf3vYim0qv\nt9b6eyOHEWG+ioL1tdxs4qoEVjr5Vo1aKOEArEE7l6RI6eCohniP4dM4quLWBtI/\nSEXMHKsXxSyNhoth1rgMeQHWNToTw8y7J3ghZI+BAoGAMHR3n2NnSGGWh5mBCsPp\naFTfMHaPqX4dxeJ16yoWZkvmwKq45FkrBzSFm7fyTKkq7gkiKjSXn4gd/l0HQc6A\nr/XUxC9wWN/CxncZjaaL6bcPGkiTL+dtSmJv3sP/mrcCQO9vUbDhatIBKrhwEdCh\nVw4D8kyeKj/rVTF3iUTW+QI=\n-----END PRIVATE KEY-----\n'
    })
});

//an array to store user's tokens (not really necessary in our case)
let tokens = [];

//an extend to EventEmmiter in order to run every 15 seconds
class EachFifteenSec extends EventEmitter{
	start(){
		this._id = setInterval(this.emit.bind(this,'fifteenSec'), 15000);
	}
}

//an event, to get a request from the app code
app.get('/fire', (req, res) => {
	let token = req.query.token;
	let symbol = req.query.symbol;
	let user = req.query.user;
    console.log(`Received save token request from ${user} for token=${token} and symbol=${symbol}`);

	if (!token) return res.status(400).json({err: "missing token"});
	if (!symbol) return res.status(400).json({err: "missing symbol"});

	tokens[user] = token;
	console.log(tokens);

	//to run every 15 sec from now on:
	let e = new EachFifteenSec();
	e.on('fifteenSec', function(){
		//the request url to get the required data from Alpha Vantage website
		let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

		//a request to the website
		https.get(url, function(res){
			//build the json output
			let body = '';
			res.on('data', function(chunk){
				body += chunk;
			});

			//json is finished, read it
			res.on('end', function(){
				let fbResponse = JSON.parse(body);
				if (fbResponse["Global Quote"] != undefined){
					//get the required price out of the json
					let price = fbResponse["Global Quote"]["05. price"] + "$";
					console.log(`price update for ${user}: ${price}`);
					console.log(`further notification vars: user =${user} token=${token} symbol=${symbol} price=${price}`);

					//a message to send to the user as a notification
					var message = {
						notification: {
							title: `${symbol} stock price update`,
							body: `${symbol}'s current price is: ${price}`
						},
						android: {
							notification: {
							  color: '#7e55c3'
							},
						},
						token: token
					};
					// Send a message to the device corresponding to the provided
					// registration token.
					admin.messaging().send(message)
					.then((response) => {
						// Response is a message ID string.
						console.log('Successfully sent message:', response);
					})
					.catch((error) => {
						console.log('Error sending message:', error);
					});
				}
			});
		}).on('error', function(e){
		console.log("Got an error: ", e);
		});
	});
	e.start();
	
    res.status(200).json({msg: "ok"});
});

//listener
app.listen(PORT, () => {
	console.log(`App is listening at http://localhost:${PORT}`)
});
