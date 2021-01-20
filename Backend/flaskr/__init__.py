from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from models import User,Post,steup_db
import bcrypt

app=Flask(__name__)
setup_db(app)
bcrypt = Bcrypt(app)

@app.route('/signup',methods=['POST'])
def signup():
    email=request.json.get('email', None)
    password=request.json.get('password', None)
    user_name=request.json.get('user_name', None)
    Bio=request.json.get('Bio', None)
    if not email:
        ##err handler
    if not password:
        ##err handler
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user=User(user_name=user_name,email=email,hash=hashed,Bio=Bio)
    user.insert()
    return

@app.route('/login',methods=['POST'])
def login():
    email=request.json.get('email', None)
    password=request.json.get('password', None)
    if not email:
        ##err handler
    if not password:
        ##err handler
    user=User.query.filter(email=email).one_or_none()
    if user is None:
        ##user not found
    if bcrypt.checkpw(password, user.hash):
        ##redirect to home
    else:
        ##wrong password
    return
     
