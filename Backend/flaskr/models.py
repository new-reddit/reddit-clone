import os
from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import json


database_path='postgres://postgres:postgres@localhost:5432/social_network'
db = SQLAlchemy()
def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()

class User(db.Model):
    __tablename__='users'
    id=Column(Integer,primary_key=True)
    user_name=Column(String)
    email=Column(String,unique=True)
    hash=Column(String)
    Bio=Column(String)


    def __init__(self, question, answer, category, difficulty):
        self.question = question
        self.answer = answer
        self.category = category
        self.difficulty = difficulty

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
        'id': self.id,
        'question': self.question,
        'answer': self.answer,
        'category': self.category,
        'difficulty': self.difficulty
    }
