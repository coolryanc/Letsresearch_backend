const GeoJSON = require('geojson');
const fs = require('fs');
const path = require('path');

exports.generateGEOJSON = function(str) {
  let filePath = path.join(__dirname, 'schoolData', 'schoolInfo_latlong.json');
  fs.readFile(filePath,'utf8',function(err,data){
    if(err){
      console.log('Read json error');
    }
    else{
      console.log('hu');
      let jsonData = JSON.parse(data);
      let geodata = [];
      for (let index in jsonData['data']){
        let detail = {
          title: jsonData['data'][index].title + jsonData['data'][index].latlong,
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
