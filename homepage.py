import json
import sys
import string

teacherlist = "./teacher.json"
url={}
with open ("./schoolData/homepages.csv","r") as file:
    lines=file.readlines()
    for index,item in enumerate(lines):
        if index==0:
            continue
        name =item.strip().split(",")[0]
        page=item.strip().split(",")[1]
        # if index==1:
        #     print page
        url[name]=page
# print url

with open ( teacherlist , "r") as file:
    teacher = json.loads(file.read())
    for item in teacher:
        name=item["id"].split("//")[0]
        if name in url:
            item["page"]=url[name]
            del url[name]
with open (teacherlist,"w") as file:
    json.dump(teacher, file)
  
            

        


