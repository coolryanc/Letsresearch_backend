var stopword = require('stopword');
var natural = require('natural')
const GeoJSON = require('geojson');
const fs = require('fs');
const path = require('path');
const gs = require('./getGeoJson');

// console.log(g);
var oldarticle="./schoolData/articleKeyword.json"
var article='./splitData/test.json' //new
// query("eye tracking");


exports.getUserQuery = function(str, callback) {
    TextOperation(function(obj, teacher){
      console.log('third');
      fs.writeFile(article, JSON.stringify(obj), function(err){
            if(err){
              console.log(err);
            }
          });
       teacher_list=[]
       for (let [k,v] of teacher)
       {
           var tem_teacher={};
           tem_teacher.id=k;
           tem_teacher.work=v;
           teacher_list.push(tem_teacher);
       }

      // console.log(teacher_list);
      fs.writeFile("teacher.json",JSON.stringify(teacher_list,null,4),function(err)
      {
          if(err) console.log(err);
      });
    });

    // query(str, function(tem) {
    //   console.log('B');
    //   callback(tem);
    // });
}

function TextOperation(callback){
    console.log('first');
    fs.readFile(oldarticle,"utf-8",function(err,data){
    if (err) throw err
    var obj = JSON.parse(data);
    var teacher=new Map();
    // console.log(obj[0]["keyWord"] );
     for (var i in obj)
     {
      //  obj[i].keyWord=tokenize(s);
       tokenize(obj[i].keyWord, function(newKeyword){
         obj[i].keyWord=newKeyword;
         var name = obj[i].name;
         var institution = obj[i].institution;
         var id =name+'//'+institution;
         var title=obj[i].title;
         if(!teacher.has(id))
         {
          //    console.log(id);
             var work=[];
             work.push(title);
             teacher.set(id,work);
         }
         else
         {
             teacher.get(id).push(title);
         }
       });
     }
     console.log('second');
     callback(obj, teacher);
    });
}


function tokenize(string, callback)
{
    string=string.replace(/&#x201C;/gi,"");
    string=string.replace(/&#x201D;/gi,"");
    string=string.replace("(Less)","");
    // console.log(string);
    // string=string.replace(/(less)/gi)," ";
    string=string.toLowerCase().split(" ");

    string=stopword.removeStopwords(string);

    for (var i in string)
     {
         string[i]=string[i].replace(/[^A-Za-z_-]+/gi,"");
         string[i]=natural.PorterStemmer.stem(string[i]);
     }
     callback(string);
    //  return string;
}

function query(string, callback)
{
   fs.readFile(article,"utf-8",function(err,data){
   if (err) throw err
   var obj = JSON.parse(data);

   tokenize(string, function(newStr){
     console.log(newStr);
     var tem=new Map();
     var id=new Set();
     // console.log(typeof obj[0]["keyWord"]);

     // console.log(obj[0].keyWord.indexOf(string[0]));

     for (var i in obj)
     {
     //    for (var j in obj[i]["keyWord"])
     //   {
             if(obj[i].keyWord.indexOf(newStr[0])>(-1))
             {
                 var check=true;
                 if(newStr.length>1)
                 {
                 newStr.forEach(function(element) {
                     // console.log(element);
                     if(obj[i].keyWord.indexOf(element)==-1)
                     {
                         check=false;
                         return;
                     }}, this);
                 }
                 if(check){
                     var teacherid=obj[i].name+"//"+obj[i].institution;
                     if (!id.has(teacherid))
                     {
                         tem.set(teacherid,1);
                         id.add(teacherid);
                     }
                     else
                     {
                         var count = tem.get(teacherid)+1;
                         tem.set(teacherid,count);
                     }
                 }
             }
     //   }
     }
     console.log('A');
     callback(tem);
     });
   });
}
