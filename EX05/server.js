let express = require('express');
let bodyParser = require('body-parser');
let url = require('url');
let path = require('path');
let fs = require('fs');
let os = require('os');

let app = express();
let port = 8080;

//parsing
//app.use(bodyParser.json());

//request: show all current tasks
app.get('/files/*', (req, res) => {
	let urlTxt = req.url;
	let urlTxtParsed = url.parse(urlTxt);
	let fileName = path.basename(urlTxtParsed.pathname);
	//read the file
	//let fileTxt = fs.readFileSync(fileName, 'utf8');
	let tmp = path.join(os.tmpdir(), fileName);
	let outstream = fs.createWriteStream(tmp);
  	res.pipe(outstream);
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
});



