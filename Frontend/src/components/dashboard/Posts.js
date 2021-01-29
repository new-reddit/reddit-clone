import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../Post';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      `http://localhost:5000/u/${localStorage.getItem('userName')}/posts`
    );
    setPosts(res.data.posts);
  }, []);
  return (
    <div className='posts'>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
