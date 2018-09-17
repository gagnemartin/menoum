import random
import urllib.request
#import mysql.connector
import robot
import sys
import json

def download_web_img(url):
    name = random.randrange(1, 1000)
    full_name = str(name) + '.jpg'
    urllib.request.urlretrieve(url, full_name)

def insert_data(data):
    query = "INSERT INTO ingredients(name, slug)" \
        "VALUES(%s, %s)"

    try:
        db = mysql.connector.connect(
            host = 'localhost',
            user = 'root',
            password = '',
            db = 'recipes'
        )
        cursor = db.cursor()

        cursor.executemany(query, data)
        if cursor.lastrowid:
            print('last insert id', cursor.lastrowid)
        else:
            print('last insert id not found')
        db.commit()
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        db.close()
        print('Insertion done.')


data = robot.recipes_spider('ricardo', 10, 2)
#data = robot.recipes_spider('ingredients', 1, 26)
data = json.dumps(data)
print(data)
#sys.exit()

#insert_data(data)
#download_web_img("http://www.ricardocuisine.com/pictures/cache/c07874de3c29ace89cc44efdec93c996_w1200_h630_cp_sc.jpg")