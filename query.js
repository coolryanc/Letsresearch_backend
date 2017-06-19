var stopword = require('stopword');
var fs = require('fs');
var natural = require('natural')


// console.log(g);
var article='./splitData/1.json'
query("eye");



function TextOperation(){
    fs.readFile(article,"utf-8",function(err,data){
    if (err) throw err
    var obj = JSON.parse(data);
    var teacher=new Map();

    // console.log(obj[0]["keyWord"] );
     for (var i in obj)
     {
       var s = obj[i].keyWord;
       obj[i].keyWord=tokenize(s);

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
     }
    
    console.log(teacher);
    
   
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
}

function tokenize(string)
{
    // console.log(string);
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
     return string;
}

function query(string)
{
    fs.readFile(article,"utf-8",function(err,data){
    if (err) throw err
    var obj = JSON.parse(data);
 
    string=tokenize(string);
    var tem=[];
    var id=new Set();
    for (var i in obj)
    {
      for (var j in obj[i]["keyWord"])
      {
          if(string==obj[i]["keyWord"][j])
            {
                var teacherid=obj[i].name+"//"+obj[i].institution;
                
                if (!id.has(teacherid))
                    tem.push(teacherid.split("//"));
                    id.add(teacherid);
                break;
            }
      }
    }
    return tem;
    });
}









// exports.getUserQuery = function(str) {
//   console.log(str);
// }

// Our IR model






// Return List [{Teacher, school}]
