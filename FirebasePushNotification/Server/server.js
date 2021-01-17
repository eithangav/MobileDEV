const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const EventEmitter = require('events').EventEmitter;
const port = 8080;

const app = express();
app.use(bodyParser.json());

//an extend to EventEmmiter in order to run every 15 sec
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
	var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=EXKNMOOUTJ53YDU2`;
	
	let e = new EachFifteenSec();
	e.on('fifteenSec', function(){
		priceNotification(url)
	});
	e.start();
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
});
