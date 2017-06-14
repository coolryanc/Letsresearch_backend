const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const vo = require('vo');
const fs = require("fs");
const path = require('path');

const URL = "https://www.usnews.com/best-graduate-schools/top-science-schools/computer-science-rankings";
const page = ['','/page+2','/page+3','/page+4'];
var school_JSONdata = [];

var nightmare = Nightmare({ show: true, width: 1200, height: 800 }); // New Nightmare

var getSchoolDetailInfo = function * (nightmareloop, forIndex) {
  for (let index in school_JSONdata ) {
    // console.log(index, school_JSONdata[index].schoolName);
    yield nightmareloop
      .goto(school_JSONdata[index].schoolURL)
      .wait('.main-content')
      .evaluate(function () {
        return document.body.innerHTML;
      })
      // .end()
      .then(function (result) {
        let $ = cheerio.load(result);
        $('.main-content > .padding-top').each(function(i, elem){
          if ($(this).children('h3').text() === 'Computer Science'){
            $(this).children('table').children('tbody').children('tr').each(function(j, trElem){
              switch(j){ // (\\n|\s+ )
                case 0:
                  school_JSONdata[index].schoolAddress = $(this).children('td:nth-child(2)').text().trim().replace('\n','').replace(/\s+ /,' ');
                  break;
                case 1:
                  school_JSONdata[index].schoolPhone = $(this).children('td:nth-child(2)').text().trim();
                  break;
                case 2:
                  school_JSONdata[index].schoolEmail = $(this).children('td:nth-child(2)').text().trim();
                  break;
                case 3:
                  school_JSONdata[index].schoolWeb = $(this).children('td:nth-child(2)').text().trim();
                  break;
              }
            });
            console.log(school_JSONdata[index]);
          }
        });
        if (index == 99){
          let filePath = path.join(__dirname, 'schoolData', 'csRanking.json');
          fs.writeFile(filePath, JSON.stringify(school_JSONdata), function(err){
            if(err){
              console.log('Can\'t record.');
            }
            else{
              console.log('Finish recording');
            }
          });// End write file
        }
      })
      .catch(function (error) {
      console.error('Search school failed:', error);
      });
  }
  return school_JSONdata;
}

var getTopOneHundredUniversity = function * () {
  for (let index in page){
    const pageUrl = URL + page[index];
    yield nightmare
      .goto(pageUrl)
      .wait('#article tbody')
      .scrollTo(300, 0)
      .evaluate(function () {
        return document.body.innerHTML;
      })
      // .end()
      .then(function (result) {
        let $ = cheerio.load(result);
        $('#article tbody tr[valign="top"]').each(function(i, elem){
          let schoolInfo = {
              schoolName: $(this).children('.college_name').children('.school-name').text(),
              schoolURL: 'https://www.usnews.com' + $(this).children('.college_name').children('.school-name').attr('href'),
              schoolAddress: '',
              schoolPhone: '',
              schoolEmail: '',
              schoolWeb: ''
          }
          school_JSONdata.push(schoolInfo);
        });
      })
      .then(function () {
        if ( school_JSONdata.length === 100 ){
          let nightmareloop = Nightmare({ show: true });
          vo(getSchoolDetailInfo(nightmareloop))(function(err, school_JSONdata) {
            console.log('Get detail info of school at all!');
          });
        }
      })
      .then(function (){
        // To mongoDB
      })
      .catch(function (error) {
      console.error('Search failed:', error);
      });
  }
}

vo(getTopOneHundredUniversity())(function(err, school_JSONdata) {
  // console.dir(school_JSONdata);
  console.log('Get all school URL, start get detail of school');
});
