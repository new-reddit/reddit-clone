import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../redux/actions/alert';

const Post = ({ post, history, setAlert, isAuthenticated }) => {
  const location = useLocation();
  const [votes, setVotes] = useState(0);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  useEffect(() => {
    setVotes(post.votes);
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
        `http://localhost:5000/vote/post/${post.id}/up`
      );
      setVotes(res.data.post.votes);
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
        `http://localhost:5000/vote/post/${post.id}/down`
      );
      setVotes(res.data.post.votes);
    } catch (error) {
      console.log(error);
      setAlert(error.response, 'danger');
    }
  };
  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/delete/post/${post.id}`);
    } catch (error) {
      setAlert(error.response, 'danger');
      return;
    }
    setAlert({ data: 'Post has been deleted' }, 'success');
    history.push('/home');
  };
  return (
    <div className='card mt-2 has-background-grey-lighter'>
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
            <Link
              to={`/post/${post.id}`}
              className='is-size-4 mb-1 has-text-dark has-text-weight-bold'
            >
              {post.title}
            </Link>
            <div className='is-flex'>
              <Link
                to={`/u/${post.user_name}`}
                className='is-size-7 mr-2 has-text-dark'
              >
                <i className='fa fa-user'></i> {post.user_name}
              </Link>
              <Link
                to={`/community/${post.community_name}`}
                className='is-size-7 mr-2 has-text-dark'
              >
                <i className='fa fa-align-justify'></i> {post.community_name}
              </Link>
              <Link
                to={`/post/${post.id}`}
                className='is-size-7 mr-2 has-text-dark'
              >
                <i className='fa fa-comment'></i>
                {' ' + post.comments_count}{' '}
                {post.comments_count > 1 ? 'Comments' : 'Comment'}
              </Link>
            </div>
            <div className='content is-size-5 mt-3'>{post.post_body}</div>
          </div>
        </div>
        {showDeleteIcon ? (
          <button
            class='delete is-medium'
            onClick={deletePost}
            style={{ position: 'absolute', top: 10, right: 10 }}
          ></button>
        ) : (
          ''
        )}
      </div>
    </div>
    // <div className='post'>
    //   <div className='post-header'>
    //     <div className='voting'>
    //       <i className='fa fa-arrow-up'></i>
    //       <p>{post.votes}</p>
    //       <i className='fa fa-arrow-down'></i>
    //     </div>
    //     <div className='post-info'>
    //       <Link to={`/post/${post.id}`} className='title'>
    //         {post.title}
    //       </Link>
    //       <div className='post-meta-info'>
    //         <Link to={`/u/${post.user_name}`}>
    //           <i className='fa fa-user'></i> {post.user_name}
    //         </Link>
    //         <Link to={`/community/${post.community_name}`}>
    //           <i className='fa fa-align-justify'></i> {post.community_name}
    //         </Link>
    //         <Link to={`/post/${post.id}`}>
    //           <i className='fa fa-comment'></i>
    //           {' ' + post.comments_count}{' '}
    //           {post.comments_count > 1 ? 'Comments' : 'Comment'}
    //         </Link>
    //       </div>
    //     </div>
    //     {showDeleteIcon ? (
    //       <div className='delete' onClick={deletePost}>
    //         <i className='fa fa-trash-alt'></i>
    //       </div>
    //     ) : (
    //       ''
    //     )}
    //   </div>
    //   <div className='post-body'>{post.post_body}</div>
    // </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert })(withRouter(Post));
