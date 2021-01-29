import React, { useEffect, useState } from 'react';
import Comment from '../Comment';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Comments = () => {
  const userName = useParams().name;
  const [comments, setComments] = useState([]);
  useEffect(async () => {
    const res = await axios.get(`http://localhost:5000/u/${userName}/comments`);
    setComments(res.data.comments);
  }, [userName]);
  return (
    <div className='container'>
      {comments.length ? (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      ) : (
        <p>There are no comments here!</p>
      )}
    </div>
  );
};

export default Comments;
