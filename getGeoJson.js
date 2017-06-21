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

exports.generateResult = function(str, callback) {
  generateAPIData(str, function(apiData){
    let filePath = path.join(__dirname, 'schoolData', 'result.json');
    fs.writeFile(filePath, JSON.stringify(apiData), function(err){
      if(err){
        console.log('Can\'t record.');
      }
      else{
        callback(apiData);
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
            console.log(result.size);
            for (let [key, value] of result.entries()) {
              let profName = key.split('//')[0];
              let schoolName = key.split('//')[1];
              let schoolRank = schoolInfoData['data'].map(function(x){return x.title;}).indexOf(schoolName);
              let paperNumber = profData[profData.map(function(x){return x.id;}).indexOf(key)].work.length;
              let item = {
                'prof': profName,
                'school': schoolName,
                'rank': 502,
                'paper': profData[profData.map(function(x){return x.id;}).indexOf(key)].work.length,
                'queryPaper': value,
                'page': profData[profData.map(function(x){return x.id;}).indexOf(key)].page,
                'latlong': ['39','180'],
                'score': 0
              };
              if (schoolRank != -1){
                item.rank = schoolRank;
                item.latlong = schoolInfoData['data'][schoolRank].latlong;
              }
              let workRatio = parseFloat(value/item.paper);
              if (workRatio > 0.2){
                // item.score=workRatio*(item.paper-1)+0.5*(502-item.rank)/502;
                item.score=0.9*workRatio/0.3*(item.paper-1)/item.paper+0.3*(item.paper/5+item.paper%5)+1*(502-item.rank)/502;
                item.score+=0.5*(25-item.rank/20-0.01*item.rank%20);
                 
                
    
                // item.score = (0.5*(item.paper-1)*value/result.size+0.5*Math.pow(2,502-item.rank))+0.05*workRatio;
                // console.log(result.size);
                // console.log(value);
                apiData.push(item);
              }
              // console.log(profName, schoolName, schoolRank, paperNumber);
            } // End for
            apiData = apiData.sort(function(a,b){return a.score < b.score ? 1:-1;})
            callback(apiData);
          }
        }); // End read prof Data
      }
    }); // End read QS ranking Data
  });
}
