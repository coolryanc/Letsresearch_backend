# -*- coding: UTF-8 -*-

import json
import sys
import string
from operator import itemgetter

def main():
    QSRANKING_FILE = open('./schoolData/schoolInfo.json', 'r') # From QS ranking Top 100
    QSjsonData = json.loads(QSRANKING_FILE.read())
    ARTICLE = open('./schoolData/articles.json', 'r')
    articlesJson = json.loads(ARTICLE.read())
    topUniversity = []
    chicken = []
    for index, school in enumerate(QSjsonData['data']):
        if index == 500:
            break
        else:
            topUniversity.append(school['title'])
    for item in articlesJson:
        rename = item['institution']
        if rename not in topUniversity:
            if rename not in chicken:
                chicken.append(rename)
    print len(chicken)
    for i in chicken:
        print i
    # area = {}
    # for item in articlesJson:
    #     if item['name'] not in area:
    #         area[item['name']] = 1
    #     else:
    #         area[item['name']] += 1
    # sortedlistOfDoc = list(sorted(area.items(), key=itemgetter(1), reverse=True))
    # for index, i in enumerate(sortedlistOfDoc):
    #     if index < 100:
    #         print i
    #     else:
    #         break

def generateAreaJson():
    area = {'AI':[], 'Systems':[], 'Theory':[], 'Interdisciplinary Areas':[]}
    with open('./schoolData/area.txt', 'r') as f:
        lines = f.read().splitlines()
        for item in lines:
            if item in area:
                pass
            else:
                conf = item.split(': ')
                for c in conf[1:]:
                    print c

if __name__ == '__main__':
    main()
    # generateAreaJson()
