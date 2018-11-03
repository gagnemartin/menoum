import settings
import mysql.connector
import os
from mysql.connector import Error

def connect():
    config = {
        'host': os.getenv('DB_HOST'),
        'user': os.getenv('DB_USERNAME'),
        'password': os.getenv('DB_PASSWORD'),
        'db': os.getenv('DB_DATABASE')
    }
    try:
        db = mysql.connector.connect(**config)

        if db.is_connected():
            return db

    except Error as e:
        print(e)

    # finally:
    #     db.close()


def all():
    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT url FROM urls WHERE crawled=false LIMIT 50")

    rows = cur.fetchall()
    ret = to_array(rows)

    cur.close()
    conn.close()

    return ret

def to_array(rows):
    data = []

    for row in rows:
        data.append({
            'url': row[0]
        })

    return data

