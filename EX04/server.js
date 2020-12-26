let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');

let app = express();
let port = 8080;

//parsing
app.use(bodyParser.json());

//request: show all current tasks
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



