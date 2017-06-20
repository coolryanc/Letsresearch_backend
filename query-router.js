const express = require('express');
const fs = require('fs');
const path = require('path');

var app = module.exports = express.Router();

app.get('/api/test', function (req, res) {
  let filePath = path.join(__dirname, 'schoolData', 'schoolInfo_latlong.json');
  fs.readFile(filePath,'utf8',function(err,data){
    if(err){
      console.log('Read json error');
    }
    else{
      let jsonData = JSON.parse(data);
      res.json(jsonData['data']);
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

app.get('/api/look', function (req, res) {
  let filePath = path.join(__dirname, 'splitData', 'test.json');
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
