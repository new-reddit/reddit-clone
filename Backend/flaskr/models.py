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
    public_id=db.Column(db.String(50),unique=True)
    user_name=Column(String)
    email=Column(String,unique=True)
    hash=Column(String(100))
    Bio=Column(String)
    admin=Column(db.Boolean)


    def __init__(self, public_id, user_name, email,hash,Bio,admin):
        self.public_id = public_id
        self.user_name = user_name
        self.email = email
        self.hash= hash
        self.Bio=Bio
        self.admin=admin


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
        'id':self.id,
        'public_id': self.public_id,
        'user_name': self.user_name,
        'email': self.email,
        'hash': self.hash,
        'Bio': self.Bio,
        'admin':self.admin
    }
