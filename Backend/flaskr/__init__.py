from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from . models import User, Post, Comment, Voter, Community, setup_db
from flask_bcrypt import Bcrypt
import jwt
import json
import datetime
from functools import wraps
from uuid import uuid4
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
setup_db(app)
app.config['SECRET_KEY'] = 'topsecret'
flask_bcrypt = Bcrypt(app)


def token_reqiured(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-auth-token' in request.headers:
            token = request.headers['x-auth-token']

        if not token:
            return jsonify({'message': 'Token is missing '}), 401

        try:
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user = User.query.filter_by(
                public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'Invalid token '}), 401

        return f(user, *args, **kwargs)
    return decorated


@app.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get('email', None)
    password = body.get('password', None)
    user_name = body.get('user_name', None)
    first_name = body.get('first_name', None)
    last_name = body.get('last_name', None)

    if not email:
        return make_response('Email must be provided', 400)
    if not password:
        return make_response('Password must be provided', 400)
    if not first_name:
        return make_response('First Name must be provided', 400)
    if not last_name:
        return make_response('Last Name must be provided', 400)

    if User.query.filter_by(email=email).one_or_none():
        return make_response('An account with this email already exists', 400)

    hashed = flask_bcrypt.generate_password_hash(password).decode('utf-8')

    user = User(public_id=str(uuid4()), first_name=first_name, last_name=last_name, user_name=user_name,
                email=email, hash=hashed)
    user.insert()
    token = jwt.encode({'public_id': user.public_id, 'exp': datetime.datetime.utcnow(
    ) + datetime.timedelta(minutes=1440)}, app.config['SECRET_KEY'])
    return jsonify({'token': token, 'user_name': user.user_name})


@app.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email', None)
    password = body.get('password', None)
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return make_response('User is not found', 400, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    if flask_bcrypt.check_password_hash(user.hash, password):
        token = jwt.encode({'public_id': user.public_id, 'exp': datetime.datetime.utcnow(
        ) + datetime.timedelta(minutes=1440)}, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'user_name': user.user_name})

    return make_response('Invalid credentials', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})


@app.route('/u/<string:user_name>')
def get_dashboard(user_name):
    user = User.query.filter(User.user_name == user_name).first()
    return jsonify({'user': user.format()})


@app.route('/u/<string:user_name>/posts')
def get_posts(user_name):
    posts = Post.query.filter(Post.user_name == user_name).all()
    posts_formatted = [post.format() for post in posts]
    return jsonify({'posts': posts_formatted})


@app.route('/u/<string:user_name>/comments')
def get_comments(user_name):
    user = User.query.filter(User.user_name == user_name).first()
    comments = Comment.query.filter(
        Comment.user_id == user.id).order_by(Comment.id).all()
    comments_formated = [comment.format() for comment in comments]
    return jsonify({'comments': comments_formated})


@app.route('/u/<string:user_name>/communities')
def get_user_communities(user_name):
    user = User.query.filter(User.user_name == user_name).first()
    communities = user.communities
    user_communities = []
    for community in communities:
        temp = {}
        temp['title'] = community.title
        temp['name'] = community.name
        temp['description'] = community.description
        temp['members_count'] = community.members_count
        user_communities.append(temp)
    return jsonify({'communities': user_communities})


@app.route('/create/post', methods=['POST'])
@token_reqiured
def create_post(user):
    body = request.get_json()
    post_body = body.get('post_body', None)
    title = body.get('title', None)
    post = Post(post_body=post_body, title=title,
                user_id=user.id, user_name=user.user_name)
    post.insert()
    return jsonify({'post': post.format()})


@app.route('/delete/post/<int:post_id>', methods=['DELETE'])
@token_reqiured
def delete_post(user, post_id):
    post = Post.query.filter(Post.id == post_id).one_or_none()
    in_community = False
    admin = None
    if post.community_name != None:
        in_community = True
        admin = Community.query.filter(
            Community.name == post.community_name).first().admin
    if post is None:
        return make_response('Post not found', 404)
    if (post.user_name == user.user_name) or ((in_community == True) and (user.user_name == admin)):
        post.delete()
        return jsonify({'message': 'Post deleted successfully'})
    return make_response('Cannot delete other users post', 400)


@app.route('/post/<int:post_id>')
def get_post(post_id):
    post = Post.query.filter(Post.id == post_id).first()
    if not post:
        return make_response('Post not found', 404)
    comments = Comment.query.filter(Comment.post_id == post_id).all()
    comments_formated = [comment.format() for comment in comments]
    return jsonify({'post': post.format(), 'comments': comments_formated})


@app.route('/create/comment/post/<int:post_id>', methods=['POST'])
@token_reqiured
def create_comment(user, post_id):
    body = request.get_json()
    comment_body = body.get('comment_body', None)
    comment = Comment(comment_body=comment_body, user_id=user.id,
                      post_id=post_id, user_name=user.user_name)
    comment.insert()
    post = Post.query.filter(Post.id == post_id).first()
    post.comments_count += 1
    post.update()
    return jsonify({'comment': comment.format()})


@app.route('/delete/comment/<int:post_id>/<int:comment_id>', methods=['DELETE'])
@token_reqiured
def delete_comment(user, post_id, comment_id):
    comment = Comment.query.filter(Comment.id == comment_id).one_or_none()
    post = Post.query.filter(Post.id == post_id).first()
    if comment is None:
        return make_response('Comment not found', 404)
    if comment.user_id == user.id:
        comment.delete()
        post.comments_count -= 1
        post.update()
        current_comments = Comment.query.filter(
            Comment.post_id == post_id).all()
        comments_formatted = [comment.format() for comment in current_comments]
        return jsonify({'comments': comments_formatted})
    return make_response('Cannot delete other users comment', 400)


@app.route('/vote/comment/<int:id>/<string:type>', methods=['PUT'])
@token_reqiured
def vote(user, id, type):
    voter = Voter.query.filter(Voter.user_id == user.id).filter(
        Voter.comment_id == id).one_or_none()
    comment = Comment.query.filter(Comment.id == id).first()
    user_voted_for = User.query.filter(
        User.user_name == comment.user_name).first()
    if user.id == comment.user_id:
        return jsonify({'message': 'Cannot vote your own comment'})
    if voter is not None:
        if type == "down" and voter.vote_type == "down":
            comment.votes += 1
            user_voted_for.karma += 1
            comment.update()
            voter.delete()
            user_voted_for.update()
            return jsonify({'votes': comment.votes})
        elif type == "up" and voter.vote_type == "up":
            comment.votes -= 1
            user_voted_for.karma -= 1
            comment.update()
            voter.delete()
            user_voted_for.update()
            return jsonify({'votes': comment.votes})
        elif type == "up" and voter.vote_type == "down":
            comment.votes += 2
            user_voted_for.karma += 2
            voter.vote_type = "up"
            voter.update()
            comment.update()
            user_voted_for.update()
            return jsonify({'votes': comment.votes})
        elif type == "down" and voter.vote_type == "up":
            comment.votes -= 2
            user_voted_for.karma -= 2
            voter.vote_type = "down"
            voter.update()
            comment.update()
            user_voted_for.update()
            return jsonify({'votes': comment.votes})

    if type == 'up':
        comment.votes += 1
        user_voted_for.karma += 1
    else:
        comment.votes -= 1
        user_voted_for.karma -= 1

    new_voter = Voter(user_id=user.id, vote_type=type, comment_id=id)
    new_voter.insert()
    comment.update()
    user.update()

    return jsonify({'votes': comment.votes})


@app.route('/create/community', methods=['POST'])
@token_reqiured
def create_community(user):
    body = request.get_json()
    name = body.get('name', None)
    description = body.get('description', None)
    topic = body.get('topic', None)
    if name is None:
        return jsonify({'message': "Community name cannot be empty"})
    if description is None:
        return jsonify({'message': "Community description cannot be empty"})
    if topic is None:
        return jsonify({'message': "Community topic cannot be empty"})
    if Community.query.filter(Community.name == name.lower().replace(
            " ", "")).one_or_none() is not None:
        return jsonify({'message': "Community with that name already exist"})

    community = Community(name=name.lower().replace(
        " ", ""), title=name, description=description, topic=topic, admin=user.user_name)
    community.insert()
    community.users.append(user)
    community.update()
    return jsonify({'community': community.format()})


@app.route('/delete/community/<string:community_name>', methods=['DELETE'])
@token_reqiured
def delete_community(user, community_name):
    community = Community.query.filter(
        Community.name == community_name).one_or_none()
    if community is None:
        return make_response('Community not found', 404)
    if community.admin != user.user_name:
        return make_response('Only admins are allowed to delete community', 400)
    community.delete()
    return jsonify({'message': 'Community successfully deleted'})


@app.route('/create/post/community/<string:community_name>', methods=['POST'])
@token_reqiured
def create_post_community(user, community_name):
    body = request.get_json()
    post_body = body.get('post_body', None)
    title = body.get('title', None)
    if post_body is None:
        return jsonify({'message': "Post body cannot be empty"})
    if title is None:
        return jsonify({'message': "Post title cannot be empty"})
    post = Post(post_body=post_body, title=title,
                user_id=user.id, user_name=user.user_name)
    post.insert()
    post.community_name = community_name
    post.update()
    return jsonify({'post': post.format()})


@app.route('/communities')
def get_communities():
    communities = Community.query.all()
    communities_formatted = [community.format() for community in communities]
    return jsonify({'communities': communities_formatted})


@app.route('/community/<string:community_name>')
def get_community(community_name):
    community = Community.query.filter(
        Community.name == community_name).one_or_none()
    if community is None:
        return jsonify({'message': 'Community not found'})
    posts = Post.query.filter(Post.community_name == community_name).all()
    posts_formatted = [post.format() for post in posts]
    current_users = []
    for user in community.users:
        current_users.append(user.user_name)
    json.dumps(current_users)
    return jsonify({'community': community.format(), 'posts': posts_formatted, 'users': current_users})


@app.route('/join/community/<string:community_name>', methods=['PUT'])
@token_reqiured
def join_community(user, community_name):
    community = Community.query.filter(
        Community.name == community_name).first()
    if user in community.users:
        return jsonify({'message': 'user already exist'})
    community.users.append(user)
    community.members_count += 1
    community.update()
    return jsonify({'community': community.format()})


@app.route('/leave/community/<string:community_name>', methods=['PUT'])
@token_reqiured
def leave_community(user, community_name):
    community = Community.query.filter(
        Community.name == community_name).first()
    if user not in community.users:
        return jsonify({'message': 'user does not exist'})
    community.users.remove(user)
    community.members_count -= 1
    community.update()
    return jsonify({'community': community.format()})
