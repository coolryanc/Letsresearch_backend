const express = require('express');
const fs = require('fs');
const path = require('path');

var app = module.exports = express.Router();

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
