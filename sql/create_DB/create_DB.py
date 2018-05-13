#!/usr/bin/python
# -*- coding: UTF-8 -*-

import pymysql
import random

db = pymysql.connect("localhost", "root", "", "wordtutor", charset='utf8' )

cursor = db.cursor()

sql = """CREATE TABLE ori_IELTS (
      id int(6),
      correct int(6),
      total int(6),
      rate float,
      date double,
      islearn int(6)
      );"""

cursor.execute(sql)

a = []

for i in range(1,15329):
    a.append(i)

b = random.sample(a,3500)

for i in range (0,3500):
    sql = """INSERT INTO ori_IELTS
            VALUES ("""+str(b[i])+""", 0, 0, 0, 0, 0)"""
    # print(sql)
    try:
    # 执行sql语句
        cursor.execute(sql)
    # 提交到数据库执行
        db.commit()
    except:
    # Rollback in case there is any error
        db.rollback()
        print(123)
    
db.close()
