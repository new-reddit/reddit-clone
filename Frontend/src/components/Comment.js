import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setAlert } from '../redux/actions/alert';
import { Link, useLocation, useParams, withRouter } from 'react-router-dom';

const Comment = ({ comment, isAuthenticated, setAlert, history }) => {
  const [votes, setVotes] = useState(0);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const location = useLocation();
  const postId = useParams().id;
  useEffect(() => {
    setVotes(comment.votes);
    if (location.pathname.includes('/post/')) {
      setShowDeleteIcon(true);
    }
  }, []);
  const voteUp = async (e) => {
    if (!isAuthenticated) {
      setAlert({ data: 'You must be logged in' }, 'danger');
      return;
    }
    const res = await axios.put(
      `http://localhost:5000/vote/comment/${comment.id}/up`
    );
    setVotes(res.data.votes);
  };
  const voteDown = async (e) => {
    if (!isAuthenticated) {
      setAlert({ data: 'You must be logged in' }, 'danger');
      return;
    }
    const res = await axios.put(
      `http://localhost:5000/vote/comment/${comment.id}/down`
    );
    setVotes(res.data.votes);
  };
  const deleteComment = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/delete/comment/${postId}/${comment.id}`
      );
    } catch (error) {
      console.log(error);
      setAlert(error.response, 'danger');
    }
    window.location.reload(false);
  };
  return (
    <div className='comment'>
      <div className='comment-header'>
        <div className='voting'>
          <i className='fa fa-arrow-up' onClick={voteUp}></i>
          <p className='votes'>{votes}</p>
          <i className='fa fa-arrow-down' onClick={voteDown}></i>
        </div>
        <div className='comment-meta-info'>
          <Link to={`/u/${comment.user_name}`}>
            <i className='fa fa-user'></i> {comment.user_name}
          </Link>
        </div>
        {showDeleteIcon ? (
          <div className='delete' onClick={deleteComment}>
            <i className='fa fa-trash-alt'></i>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='comment-body'>{comment.comment_body}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert })(withRouter(Comment));
