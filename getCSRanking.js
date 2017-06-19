const request = require('request');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const vo = require('vo');
const fs = require("fs");
const path = require('path');

const CSURL = 'http://csrankings.org/';

var nightmare = Nightmare({ show: true, width: 1200, height: 800, typeInterval: 2 });



var getPaperAbstract = function * (jsonData) {
  for (let index in jsonData){
    jsonData[index].keyWord = jsonData[index].title;
    yield nightmare
      .goto("https://www.semanticscholar.org/")
      .type('input[name="q"]', jsonData[index].title + '\u000d')
      .wait('.result-page')
      .click('.result-page > .search-result:nth-child(1) .abstract .more')
      .evaluate(function () {
        return document.body.innerHTML;
      })
      .then(function (result) {
        let $ = cheerio.load(result);
        let abstract = $('.result-page > .search-result:nth-child(1) .abstract').text();
        jsonData[index].keyWord = abstract;
        // console.log(jsonData[index]);
      })
      .then(function () {
        let savefilePath = path.join(__dirname, 'splitData', '2.json');
        fs.writeFile(savefilePath, JSON.stringify(jsonData), function(err){
          if(err){
            console.log('Can\'t record.');
          }
          else{
            // console.log('Finish recording');
          }
        });// End write file
      })
      .catch(function (error) {
        console.log('Search error');
      })
  }
}


let filePath = path.join(__dirname, 'splitData', 'articles2.json');
fs.readFile(filePath,'utf8',function(err,data){
  if(err){
    console.log('Read json error');
  }
  else{
    let jsonData = JSON.parse(data);
    vo(getPaperAbstract(jsonData))(function (err, jsonData){
      console.log('Get all paper abstract!');},
      function(){
        console.log('Finish');
    })
  }
});
