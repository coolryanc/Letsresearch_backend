const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');

var app = express();
const queryCalc = require('./query');
const gs = require('./getGeoJson');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Resolve CROS problem
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

app.get('/submit-data', function (req, res) {
    console.log(req.query.searchString); // Get user query
    gs.generateResult(req.query.searchString);
    res.sendStatus(200);
});

app.use(require('./query-router'));
app.use(require('./keyword-router'));

app.listen(3001, function () {
    console.log('listening in http://localhost:3001');
});
