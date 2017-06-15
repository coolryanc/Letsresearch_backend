const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send("<html><body><h1>Hello World..</h1></body></html>");
});

app.get('/submit-data', function (req, res) {
    console.log(req.query.searchString);
    res.send(req.query.searchString);
});


app.get('/api/test', function (req, res) {
  let filePath = path.join(__dirname, 'schoolData', 'csRanking.json')
  fs.readFile(filePath,'utf8',function(err,data){
    if(err){
      console.log('Read json error');
    }
    else{
      let jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});


app.listen(3001, function () {
    console.log('listening in http://localhost:3001');
});
