import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { loadUser } from '../redux/actions/user';
import Post from './Post';
import { Redirect } from 'react-router-dom';

const Home = ({ loadUser, isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  useEffect(async () => {
    loadUser();
    const res = await axios.get('http://localhost:5000/home');
    setPosts(res.data.posts);
  }, []);
  if (!isAuthenticated) {
    return <Redirect to='login' />;
  }
  return (
    <div className='container p-4'>
      {posts.length ? (
        posts.map((post) => <Post post={post} />)
      ) : (
        <p className='title'>You are up to date</p>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { loadUser })(Home);
