import React, { useEffect, useState } from 'react';
import Post from './Post';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';
import { setAlert } from '../redux/actions/alert';
import { connect } from 'react-redux';

const PostPage = ({ isAuthenticated, setAlert, history }) => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();

  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.length) {
      setAlert({ data: 'Comment cannot be empty' }, 'danger');
      return;
    }
    const body = JSON.stringify({
      comment_body: comment,
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(
      `http://localhost:5000/create/comment/post/${id}`,
      body,
      config
    );
    setComment('');
    setComments([res.data.comment, ...comments]);
  };
  useEffect(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/post/${id}`);
      setPost(res.data.post);
      setComments(res.data.comments);
    } catch (error) {
      history.push('/404');
    }
  }, []);
  return (
    <div className='container'>
      <Post post={post} />
      {isAuthenticated ? (
        <form className='add-comment' onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={handleChange}
            name='comment'
            cols='10'
            rows='5'
            placeholder='Add a comment'
          ></textarea>
          <button>Add</button>
        </form>
      ) : (
        ''
      )}
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert })(PostPage);
