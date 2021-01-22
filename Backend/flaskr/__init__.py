from flask import Flask,request,jsonify,make_response
from flask_sqlalchemy import SQLAlchemy
from . models import User,setup_db
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
            data = jwt.decode(token,app.config['SECRET_KEY'])
            current_user = User.query.filter_by(public_id = data['public_id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}) , 401
        return f(current_user, *args , **kwargs)
    return decorated

@app.route('/signup',methods=['POST'])
def signup():
    body=request.get_json()
    email=body.get('email', None)
    password=body.get('password', None)
    user_name=body.get('user_name', None)
    Bio=body.get('Bio', None)
    if not email:
        return make_response('Email must be provided',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})
    if not password:
        return make_response('Password must be provided',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})
    if User.query.filter_by(email=email).one_or_none():
        return make_response('An account with this email already exists',400,{'WWW-Authenticate' : 'Basic realm="Login required!"'})

    hashed =flask_bcrypt.generate_password_hash(password).decode('utf-8')

    user=User(public_id=str(uuid4()),user_name=user_name,email=email,hash=hashed,Bio=Bio,admin=False)
    user.insert()
    token = jwt.encode({'public_id' : user.public_id, 'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes = 1440)},app.config['SECRET_KEY'])
    return jsonify ({'token': token, 'user':user.user_name})


@app.route('/login',methods=['POST'])
def login():
    # auth=request.authorization
    # if not auth or not auth.username or not auth.password:
    #     return make_response('Could not verify',401,{'WWW-Authenticate' : 'Basic realm="Login required!"'})
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
