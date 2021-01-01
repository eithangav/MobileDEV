let express = require('express');
let bodyParser = require('body-parser');
let url = require('url');
let path = require('path');
let fs = require('fs');
let app = express();
let port = 8080;

//request by 'files/filename'
//prints the file's content into the browser
app.get('/files/*', (req, res) => {
	//get url
	let urlTxt = req.url;
	//parse url
	let urlTxtParsed = url.parse(urlTxt);
	//extract filename
	let fileName = path.basename(urlTxtParsed.pathname);
	//create file's full path
	let filePath = path.dirname(require.main.filename) + '\\' + fileName;
	//create a stream with files content
	let outstream = fs.createReadStream(filePath);
	//pipe it out
	outstream.pipe(res);

});

//listener
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
});



