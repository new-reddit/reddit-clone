import os
import sqlalchemy
from sqlalchemy import Column, String, Integer, create_engine, DateTime
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import json
import datetime


database_path = "postgresql://postgres:@localhost:5432/social_network"

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
    first_name = Column(String)
    last_name = Column(String)
    user_name = Column(String, unique=True)
    email = Column(String, unique=True)
    hash = Column(String)
    Bio = Column(String)
    karma = Column(Integer, default=0)
    posts = db.relationship('Post', backref='user')
    comments = db.relationship('Comment', backref='user')
    communities = db.relationship(
        'Community', secondary='members', backref=db.backref('users', lazy='dynamic'))
    created_at = Column(
        String, default=datetime.date.today().strftime("%d-%m-%Y"))

    def __init__(self, public_id, first_name, last_name, user_name, email, hash):
        self.public_id = public_id
        self.first_name = first_name
        self.last_name = last_name
        self.user_name = user_name
        self.email = email
        self.hash = hash

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
            'first_name': self.first_name,
            'last_name': self.last_name,
            'user_name': self.user_name,
            'email': self.email,
            'hash': self.hash,
            'Bio': self.Bio,
            'karma': self.karma,
            'created_at': self.created_at
        }


class Post(db.Model):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True)
    post_body = Column(String)
    title = Column(String)
    votes = Column(Integer, default=0)
    user_name = Column(String)
    comments = db.relationship('Comment', backref='post')
    comments_count = Column(Integer, default=0)
    user_id = Column(Integer, db.ForeignKey('users.id'))
    community_name = Column(String, db.ForeignKey('communities.name'))
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
            'user_name': self.user_name,
            'comments_count': self.comments_count,
            'user_id': self.user_id,
            'community_name': self.community_name,
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
    voters = db.relationship('Voter', backref='comment')
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
    name = Column(String, unique=True)
    title = Column(String)
    description = Column(String)
    admin = Column(String)
    topic = Column(String)
    members_count = Column(Integer, default=1)
    posts = db.relationship('Post', backref='community')
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

    def __init__(self, name, title, description, topic, admin):
        self.name = name
        self.title = title
        self.description = description
        self.admin = admin
        self.topic = topic

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
            'name': self.name,
            'title': self.title,
            'description': self.description,
            'topic': self.topic,
            'members_count': self.members_count,
            'admin': self.admin,
            'created_at': self.created_at
        }


class Member(db.Model):
    __tablename__ = 'members'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, db.ForeignKey('users.id'))
    community_id = Column(Integer, db.ForeignKey('communities.id'))


class Voter(db.Model):
    __tablename__ = 'voters'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    vote_type = Column(String)
    comment_id = Column(Integer, db.ForeignKey('comments.id'))
    post_id = Column(Integer, db.ForeignKey('posts.id'))

    def __init__(self, user_id, vote_type, comment_id=None, post_id=None):
        self.user_id = user_id
        self.vote_type = vote_type
        self.comment_id = comment_id
        self.post_id = post_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
