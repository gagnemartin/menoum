import settings
import mysql.connector
import os
from mysql.connector import Error

class Connection:
    def __init__(self, table):
        print('Connection to DB.')
        self.table = table
        self.action = None
        self.conditions = None
        self.limit = None
        self.query = ''

    def get(self, fields='*'):
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

    def first(self):
        self.limit = str(1)
        self.query = self.query + ' LIMIT ' + self.limit

        Connection.call(self)

        return self

    def max(self, limit):
        self.limit = str(limit)
        self.query = self.query + ' LIMIT ' + self.limit

        Connection.call(self)

        return self

    def all(self):
        Connection.call(self)
        return self

    @staticmethod
    def call(self):
        print(self.query)


q = Connection('urls')
q.get('test').where([
    ['crawled', None],
]).first()

print(q)
