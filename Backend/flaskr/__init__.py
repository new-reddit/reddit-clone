from flask import Flask,request,jsonify,make_response
from flask_sqlalchemy import SQLAlchemy
from . models import User,Post,Comment,Voter,setup_db
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps
from uuid import uuid4
import sys
from flask_cors import CORS

app=Flask(__name__)
CORS(app)
setup_db(app)
app.config['SECRET_KEY']='topsecret'
flask_bcrypt=Bcrypt(app)


def token_reqiured(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token=None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token :
            return jsonify({'message' : 'Token is missing '}) , 401

        try:
            data = jwt.decode(token,app.config['SECRET_KEY'],algorithms=["HS256"])
            current_user = User.query.filter_by(public_id = data['public_id']).first()
        except:
            return jsonify({'message' : 'Invalid token '}) , 401

        return f(current_user, *args , **kwargs)
    return decorated

@app.route('/signup',methods=['POST'])
def signup():
    body=request.get_json()
    email=body.get('email', None)
    password=body.get('password', None)
    user_name=body.get('user_name', None)
    if not email:
        return make_response('Email must be provided',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})
    if not password:
        return make_response('Password must be provided',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})
    if User.query.filter_by(email=email).one_or_none():
        return make_response('An account with this email already exists',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})

    hashed =flask_bcrypt.generate_password_hash(password).decode('utf-8')

    user=User(public_id=str(uuid4()),user_name=user_name,email=email,hash=hashed)
    user.insert()
    token = jwt.encode({'public_id' : user.public_id, 'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes = 1440)},app.config['SECRET_KEY'])
    return jsonify ({'token': token, 'user':user.user_name})


@app.route('/login',methods=['POST'])
def login():
    body=request.get_json()
    email=body.get('email', None)
    password=body.get('password', None)
    user=User.query.filter_by(email=email).one_or_none()
    if user is None:
        return make_response('User is not found',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})
    if flask_bcrypt.check_password_hash(user.hash, password):
        token = jwt.encode({'public_id' : user.public_id, 'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes = 1440)},app.config['SECRET_KEY'])
        return jsonify({'token': token, 'user':user.user_name})

    return make_response('Invalid credentials',401,{'WWW-Authenticate' : 'Basic realm="Login required!"'})

@app.route('/u/<string:public_id>')
def get_dashboard(public_id):
    user = User.query.filter(User.public_id == public_id).first()
    posts = Post.query.filter(Post.user_id == user.id).order_by(Post.id).all()
    posts_formated=[post.format() for post in posts]
    return jsonify({'posts':posts_formated,'user' : user.user_name})

@app.route('/u/<string:public_id>/comments')
def get_comments(public_id):
    user = User.query.filter(User.public_id == public_id).first()
    comments = Comment.query.filter(Comment.user_id == user.id ).order_by(Comment.id).all()
    comments_formated=[comment.format() for comment in comments]
    return jsonify({'comments' : comments_formated, 'name' : user.user_name})

@app.route('/create/post', methods=['POST'])
@token_reqiured
def create_post(current_user):
    body=request.get_json()
    post_body=body.get('post_body', None)
    title=body.get('title' , None)
    post=Post(post_body=post_body,title=title,user_id=current_user.id)
    post.insert()
    return jsonify({'post': post.format(),'name':current_user.user_name})

@app.route('/post/<int:post_id>')
def get_post(post_id):
    post=Post.query.filter(Post.id == post_id ).first()
    comments=Comment.query.filter(Comment.post_id == post_id).all()
    comments_formated=[comment.format() for comment in comments]
    return jsonify({'post':post.format(),'comments' : comments_formated})

@app.route('/create/comment/post/<int:post_id>', methods=['POST'])
@token_reqiured
def create_comment(current_user,post_id):
    body=request.get_json()
    comment_body=body.get('comment_body', None)
    comment=Comment(comment_body=comment_body,user_id=current_user.id,post_id=post_id,user_name=current_user.user_name)
    comment.insert()
    post=Post.query.filter(Post.id == post_id).first()
    post.comments_count += 1
    post.update()
    return jsonify({'name': current_user.user_name, 'comment' : comment.format()})

@app.route('/vote/comment/<int:id>/<string:type>', methods=['PUT'])
@token_reqiured
def vote(current_user,id,type):
    voter = Voter.query.filter(Voter.user_id == current_user.id).filter(Voter.comment_id == id).one_or_none()
    comment = Comment.query.filter(Comment.id == id).first()
    if current_user.id == comment.user_id:
        return jsonify({'message':'Cannot vote your own comment'})
    if voter is not None:
        if type == "down" and voter.vote_type == "down":
            comment.votes += 1
            current_user.karma += 1
            comment.update()
            voter.delete()
            current_user.update()
            return jsonify({'votes' : comment.votes})
        elif type == "up" and voter.vote_type == "up":
            comment.votes -= 1
            current_user.karma -= 1
            comment.update()
            voter.delete()
            current_user.update()
            return jsonify({'votes' : comment.votes})
        elif type == "up" and voter.vote_type == "down":
            comment.votes += 2
            current_user.karma += 2
            voter.vote_type = "up"
            voter.update()
            comment.update()
            current_user.update()
            return jsonify({'votes' : comment.votes})
        elif type == "down" and voter.vote_type == "up":
            comment.votes -= 2
            current_user.karma -= 2
            voter.vote_type = "down"
            voter.update()
            comment.update()
            current_user.update()
            return jsonify({'votes' : comment.votes})

    if type == 'up':
        comment.votes += 1
        current_user.karma += 1
    else :
        comment.votes -= 1
        current_user.karma -= 1

    new_voter = Voter(user_id = current_user.id , vote_type = type , comment_id = id)
    new_voter.insert()
    comment.update()
    current_user.update()

    return jsonify({'votes' : comment.votes})
