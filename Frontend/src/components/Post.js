import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../redux/actions/alert';

const Post = ({ post, history, setAlert }) => {
  const location = useLocation();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  useEffect(() => {
    if (location.pathname.includes('/post/')) {
      setShowDeleteIcon(true);
    }
  });
  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/delete/post/${post.id}`);
    } catch (error) {
      console.log(error);
      setAlert(error.response, 'danger');
    }
    setAlert({ data: 'Post has been deleted' }, 'success');
    history.push('/');
  };
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
            <Link to={`/u/${post.user_name}`}>
              <i className='fa fa-user'></i> {post.user_name}
            </Link>
            <Link to={`/community/${post.community_name}`}>
              <i className='fa fa-align-justify'></i> {post.community_name}
            </Link>
            <Link to={`/post/${post.id}`}>
              <i className='fa fa-comment'></i>
              {' ' + post.comments_count}{' '}
              {post.comments_count > 1 ? 'Comments' : 'Comment'}
            </Link>
          </div>
        </div>
        {showDeleteIcon ? (
          <div className='delete' onClick={deletePost}>
            <i className='fa fa-trash-alt'></i>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='post-body'>{post.post_body}</div>
    </div>
  );
};

export default connect(null, { setAlert })(withRouter(Post));
