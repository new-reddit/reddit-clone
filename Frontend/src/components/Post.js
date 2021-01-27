import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  return (
    <div className='post'>
      <div className='post-header'>
        <div className='voting'>
          <i className='fa fa-arrow-up'></i>
          <p>{post.votes}</p>
          <i className='fa fa-arrow-down'></i>
        </div>
        <div className='post-info'>
          <Link to={`/post/${post.id}`} className='title'>
            {post.title}
          </Link>
          <div className='post-meta-info'>
            <p>
              <i className='fa fa-user'></i> {post.user_name}
            </p>
            <p>
              <i className='fa fa-clock'></i> 6 Hours
            </p>
            <p>
              <i className='fa fa-align-justify'></i> Web Development
            </p>
            <Link to={`/post/${post.id}`}>
              <i className='fa fa-comment'></i>
              {' ' + post.comments_count}{' '}
              {post.comments_count > 1 ? 'Comments' : 'Comment'}
            </Link>
          </div>
        </div>
      </div>
      <div className='post-body'>{post.post_body}</div>
    </div>
  );
};

export default Post;
