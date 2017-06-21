const express = require('express');
const fs = require('fs');
const path = require('path');

var app = module.exports = express.Router();

app.get('/api/result', function (req, res) {
  let filePath = path.join(__dirname, 'schoolData', 'result.json');
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

app.get('/api/map', function (req, res) {
  let filePath = path.join(__dirname, 'schoolData', 'stations.geojson');
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
