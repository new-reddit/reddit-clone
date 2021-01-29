import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../Post';
import { useParams } from 'react-router-dom';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const userName = useParams().name;
  useEffect(async () => {
    const res = await axios.get(`http://localhost:5000/u/${userName}/posts`);
    setPosts(res.data.posts);
  }, [userName]);
  return (
    <div>
      {posts.length ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>There are no posts here!</p>
      )}
    </div>
  );
};

export default Posts;
