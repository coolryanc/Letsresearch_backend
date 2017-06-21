const GeoJSON = require('geojson');
const fs = require('fs');
const path = require('path');
const queryCalc = require('./query');

exports.generateGEOJSON = function(str) {
  let filePath = path.join(__dirname, 'schoolData', 'schoolInfo_latlong.json');
  fs.readFile(filePath,'utf8',function(err,data){
    if(err){
      console.log('Read json error');
    }
    else{
      let jsonData = JSON.parse(data);
      let geodata = [];
      for (let index in jsonData['data']){
        let detail = {
          title: jsonData['data'][index].title,
          icon: "town-hall",
          lat: parseFloat(jsonData['data'][index].latlong[0]),
          lng: parseFloat(jsonData['data'][index].latlong[1]),
        };
        geodata.push(detail);
      }
      let geo = GeoJSON.parse(geodata, {Point: ['lat', 'lng']}); // Generate GeoJson Data
      let saveFilePath = path.join(__dirname, 'schoolData', 'stations.geojson');
      fs.writeFile(saveFilePath, JSON.stringify(geo), function(err){
        if(err){
          console.log('Can\'t record.');
        }
        else{
          console.log('Finish recording');
        }
      });//  End write file
    }
  });
}

exports.generateResult = function(str) {
  generateAPIData(str, function(apiData){
    let filePath = path.join(__dirname, 'schoolData', 'result.json');
    fs.writeFile(filePath, JSON.stringify(apiData), function(err){
      if(err){
        console.log('Can\'t record.');
      }
      else{
        console.log('Finish recording');
      }
    });// End write file
  });
}

function generateAPIData (str, callback) {
  queryCalc.getUserQuery(str, function(result){
    // console.log(result);
    let filePath = path.join(__dirname, 'schoolData', 'schoolInfo_latlong.json');
    fs.readFile(filePath,'utf8',function(err,data){
      if(err){
        console.log('Read json error');
      }
      else{
        let profFilePath = path.join(__dirname, 'teacher.json');
        fs.readFile(profFilePath,'utf8',function(err,profdata){
          if(err){
            console.log('Read json error');
          }
          else{
            let apiData = [];
            let profData = JSON.parse(profdata);
            let schoolInfoData = JSON.parse(data);
            for (let [key, value] of result.entries()) {
              let profName = key.split('//')[0];
              let schoolName = key.split('//')[1];
              let schoolRank = schoolInfoData['data'].map(function(x){return x.title;}).indexOf(schoolName);
              let paperNumber = profData[profData.map(function(x){return x.id;}).indexOf(key)].work.length;
              let item = {
                'prof': profName,
                'school': schoolName,
                'rank': 600,
                'paper': profData[profData.map(function(x){return x.id;}).indexOf(key)].work,
                'page': profData[profData.map(function(x){return x.id;}).indexOf(key)].page,
                'latlong': ['39','180']
              };
              if (schoolRank != -1){
                item.rank = schoolRank;
                item.latlong = schoolInfoData['data'][schoolRank].latlong;
              }
              apiData.push(item);
              // console.log(profName, schoolName, schoolRank, paperNumber);
            } // End for
            callback(apiData);
          }
        }); // End read prof Data
      }
    }); // End read QS ranking Data
  });
}
