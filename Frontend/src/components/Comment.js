import React from 'react';

const Comment = ({ comment }) => {
  return (
    <div className='comment'>
      <div className='comment-header'>
        <div className='voting'>
          <i className='fa fa-arrow-up'></i>
          <p>8</p>
          <i className='fa fa-arrow-down'></i>
        </div>
        <div className='comment-meta-info'>
          <p>
            <i className='fa fa-user'></i> {comment.user_name}
          </p>
          <p>
            <i className='fa fa-clock'></i> 6 Hours
          </p>
        </div>
      </div>
      <div className='comment-body'>{comment.comment_body}</div>
    </div>
  );
};

export default Comment;
