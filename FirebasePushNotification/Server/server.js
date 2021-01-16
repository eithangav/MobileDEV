const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;

const app = express();
app.use(bodyParser.json());

let companySymbol;

//get requite symbol from app (/symbol-update?symbol=xxx)
app.get('/symbol-update', (req, res) => {
	companySymbol = req.query.symbol;
	console.log('got new symbol from app: ${companySymbol}. activating alphavangate automatic requests.');
	alphaVantageActivate();
});

//get aphpavantage's symbol's json and commit push notification every 15 sec
function alphaVantageActivate(){
	
}









app.get('/tasks', (req, res) => {
	//read the json
	let data = fs.readFileSync('data.json', 'utf8');
	let strData = JSON.parse(data);

	//send the json to the user
  	res.send(strData);
});

//request: add a new task
app.get('/tasks/new', (req, res) => {
	//store the requested task's id and content
	let id = parseInt(req.query.id);
	let content = req.query.task;

	//read the json for editing
	let data = fs.readFileSync('data.json', 'utf8');
	let strData = JSON.parse(data);

	//add the new requested task
	strData.tasks.push({id: id, content: content});

	//update changes in the json
	fs.writeFileSync('data.json', JSON.stringify(strData), 'utf8');

	//send the json to the user
	res.send(strData);
});

//request: delete task by id
app.get('/tasks/remove', (req, res) => {
	//store the requested task's id
	let id = parseInt(req.query.id);

	//read the json for editing
	let data = fs.readFileSync('data.json', 'utf8');
	let strData = JSON.parse(data);

	//find and remove the requested task's object by id
	let index = strData.tasks.findIndex(x => x.id == id);
	if (index >= 0) 
		strData.tasks.splice(index, 1);
	
	//update changes in the json
	fs.writeFileSync('data.json', JSON.stringify(strData), 'utf8');

	//send the json to the user
	res.send(strData);
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
});



