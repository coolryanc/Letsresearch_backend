const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

app.get('/', function (req, res) {
    res.send("<html><body><h1>Hello World..</h1></body></html>");
});

app.get('/submit-data', function (req, res) {
    console.log(req.query.searchString);
    res.send(req.query.searchString);
});


app.get('/api/test', function (req, res) {
  let filePath = path.join(__dirname, 'schoolData', 'test.json');
  fs.readFile(filePath,'utf8',function(err,data){
    if(err){
      console.log('Read json error');
    }
    else{
      let jsonData = JSON.parse(data);
      res.jsonp(jsonData);
    }
  });
});

app.get('/api/keywords', function (req, res) {
  let filePath = path.join(__dirname, 'schoolData', 'keywords.json');
  fs.readFile(filePath,'utf8',function(err,data){
    if(err){
      console.log('Read json error');
    }
    else{
      let jsonData = JSON.parse(data);
      res.jsonp(jsonData);
    }
  });
});


app.listen(3001, function () {
    console.log('listening in http://localhost:3001');
});
