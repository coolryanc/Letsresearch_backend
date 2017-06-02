
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var phantomjs = require('phantomjs')
// var http = require('http');
var fs = require("fs");

const URL = "https://www.usnews.com/best-graduate-schools/top-science-schools/computer-science-rankings";

var app = express();

var getUniversityInfo = function (req, res) {
  request(URL, function (e, r, b){
    if(e || !b) {
      console.log(e);
      return;
    }
    res.send(b);
  })
}

// req server, res send message to browser
app.get('/', getUniversityInfo);

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
