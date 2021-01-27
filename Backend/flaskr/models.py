import os
import sqlalchemy
from sqlalchemy import Column, String, Integer, create_engine, DateTime
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import json
import datetime

database_path = 'postgres://postgres:123456@localhost:5432/social_network'
db = SQLAlchemy()


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()


class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    public_id = Column(db.String(50), unique=True)
    user_name = Column(String)
    email = Column(String, unique=True)
    hash = Column(String())
    Bio = Column(String)
    admin = Column(db.Boolean)
    posts = db.relationship('Post', backref='user')
    comments = db.relationship('Comment', backref='user')
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

    def __init__(self, public_id, user_name, email, hash, Bio, admin):
        self.public_id = public_id
        self.user_name = user_name
        self.email = email
        self.hash = hash
        self.Bio = Bio
        self.admin = admin

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
            'public_id': self.public_id,
            'user_name': self.user_name,
            'Bio': self.Bio,
            'admin': self.admin,
            'created_at': self.created_at
        }


class Post(db.Model):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True)
    post_body = Column(String)
    title = Column(String)
    votes = Column(Integer, default=0)
    comments = db.relationship('Comment', backref='post')
    comments_count = Column(Integer, default=0)
    user_id = Column(Integer, db.ForeignKey('users.id'))
    user_name = Column(String)
    community_id = Column(Integer, db.ForeignKey('communities.id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

    def __init__(self, post_body, title, user_id, user_name):
        self.post_body = post_body
        self.title = title
        self.user_id = user_id
        self.user_name = user_name

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
            'post_body': self.post_body,
            'title': self.title,
            'votes': self.votes,
            'comments_count': self.comments_count,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'created_at': self.created_at
        }


class Comment(db.Model):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    comment_body = Column(String)
    user_name = Column(String)
    user_id = Column(Integer, db.ForeignKey('users.id'))
    post_id = Column(Integer, db.ForeignKey('posts.id'))
    votes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

    def __init__(self, comment_body, user_id, post_id, user_name):
        self.comment_body = comment_body
        self.user_id = user_id
        self.post_id = post_id
        self.user_name = user_name

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
            'comment_body': self.comment_body,
            'votes': self.votes,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'user_name': self.user_name,
            'created_at': self.created_at
        }


class Community(db.Model):
    __tablename__ = 'communities'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    posts = db.relationship('Post', backref='community')
    created_at = Column(DateTime, default=datetime.datetime.utcnow())
    creator_id = Column(Integer)

    def __init__(self, name, description, creator_id):
        self.name = name
        self.description = description
        self.creator_id = creator_id

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
            'name': self.name,
            'description': self.description,
            'creator_id': self.user_id,
            'created_at': self.created_at
        }
