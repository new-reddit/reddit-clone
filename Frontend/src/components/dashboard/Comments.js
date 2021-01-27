import React, { useEffect, useState } from 'react';
import Comment from '../Comment';
import axios from 'axios';

const Comments = () => {
  const [comments, setComments] = useState([]);
  useEffect(async () => {
    const res = await axios.get('http://localhost:5000/u/comments');
    setComments(res.data.comments);
  });
  return (
    <div className='container'>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
