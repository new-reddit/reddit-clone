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
    console.log('Yay');
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
    try {
      const res = await axios.put(
        `http://localhost:5000/vote/comment/${comment.id}/up`
      );
      setVotes(res.data.votes);
    } catch (error) {
      console.log(error);
      setAlert(error.response, 'danger');
    }
  };
  const voteDown = async (e) => {
    if (!isAuthenticated) {
      setAlert({ data: 'You must be logged in' }, 'danger');
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/vote/comment/${comment.id}/down`
      );
      setVotes(res.data.votes);
    } catch (error) {
      console.log(error);
      setAlert(error.response, 'danger');
    }
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
    <div
      className='card mt-2 has-background-grey-lighter'
      style={{ position: 'relative' }}
    >
      <div className='card-content'>
        <div className='is-flex is-flex-direction-row is-align-items-start'>
          <div className='is-flex is-flex-direction-column is-align-items-center mr-2'>
            <i
              className='fa fa-arrow-up'
              style={{ cursor: 'pointer' }}
              onClick={voteUp}
            ></i>
            <p>{votes}</p>
            <i
              className='fa fa-arrow-down'
              style={{ cursor: 'pointer' }}
              onClick={voteDown}
            ></i>
          </div>
          <div className='is-flex is-flex-direction-column'>
            <div>
              <Link
                to={`/u/${comment.user_name}`}
                className='is-size-7 mr-2 has-text-dark'
              >
                <i className='fa fa-user'></i> {comment.user_name}
              </Link>
            </div>
            <div className='content is-size-5 mt-3'>{comment.comment_body}</div>
          </div>
          {showDeleteIcon ? (
            <button
              class='delete is-medium'
              onClick={deleteComment}
              style={{ position: 'absolute', top: 10, right: 10 }}
            ></button>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert })(withRouter(Comment));
