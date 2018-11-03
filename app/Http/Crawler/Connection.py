import settings
import mysql.connector
import os
from mysql.connector import Error


class Connection:
    def __init__(self, table):
        # print('Connection to DB.')
        self.table = table
        self.action = None
        self.conditions = None
        self.limit = None
        self.query = ''

    @staticmethod
    def connect(self):
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

    def select(self, fields='*'):
        self.action = 'SELECT'
        self.fields = fields
        self.query = 'SELECT ' + fields + ' FROM ' + self.table

        return self

    def where(self, conditions):
        self.conditions = ''
        i = 0
        for field, value in conditions:
            if value is None:
                value = 'false'
            if i is not 0:
                self.conditions = self.conditions + ' AND'

            self.conditions = self.conditions + ' ' + field + '=' + value
            i = i + 1

        self.query = self.query + ' WHERE' + self.conditions

        return self

    def max(self, limit):
        self.limit = str(limit)
        self.query = self.query + ' LIMIT ' + self.limit

        return self

    def first(self):
        self.limit = str(1)
        self.query = self.query + ' LIMIT ' + self.limit

        return Connection.call(self)

    def get(self):
        return Connection.call(self)

    def all(self):
        return Connection.call(self)

    @staticmethod
    def call(self):
        conn = Connection.connect(self)
        cur = conn.cursor()
        cur.execute(self.query)

        rows = cur.fetchall()
        a = Connection.to_array(self, rows)

        cur.close()
        conn.close()

        return a

    @staticmethod
    def to_array(self, rows):
        a = []

        for row in rows:
            a.append({
                'url': row[0]
            })

        return a
