import React, { useEffect, useState } from 'react';
import Post from './Post';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();

  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const res = await axios.get(`http://localhost:5000/post/${id}`);
    setPost(res.data.post);
    setComments(res.data.comments);
  }, []);
  return (
    <div className='container'>
      <Post post={post} />
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
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default PostPage;
