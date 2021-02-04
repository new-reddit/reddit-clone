import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Post from './Post';
import { setAlert } from '../redux/actions/alert';

const CommunityPage = ({ isAuthenticated, history, setAlert }) => {
  const [posts, setPosts] = useState([]);
  const [community, setCommunity] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const name = useParams().name;
  useEffect(() => {
    if (community.admin === localStorage.getItem('userName')) {
      setIsAdmin(true);
    }
  }, [community]);
  useEffect(async () => {
    const res = await axios.get(`http://localhost:5000/community/${name}`);
    setCommunity(res.data.community);
    setPosts(res.data.posts);
    setIsJoined(
      res.data.users.filter((user) => user === localStorage.getItem('userName'))
        .length > 0
    );
  }, []);
  const join = async () => {
    const res = await axios.put(
      `http://localhost:5000/join/community/${community.name}`
    );
    setCommunity(res.data.community);
    setIsJoined(true);
  };
  const leave = async () => {
    const res = await axios.put(
      `http://localhost:5000/leave/community/${community.name}`
    );
    setCommunity(res.data.community);
    setIsJoined(false);
  };
  const deleteCommunity = async () => {
    await axios.delete(
      `http://localhost:5000/delete/community/${community.name}`
    );
    setAlert({ data: 'Community has been deleted' }, 'success');
    history.push('/home');
  };
  return (
    <div className='container is-flex is-flex-wrap-wrap'>
      <div className='is-flex-grow-1 mr-2'>
        {posts.length ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p className='title'>There are no posts here!</p>
        )}
      </div>
      <div>
        <div className='card px-5'>
          <h2 className='title'>{community.title}</h2>
          <p className='subtitle'>{community.description}</p>
          <p>Members: {community.members_count}</p>
          {isAuthenticated ? (
            isAdmin ? (
              <button
                className='button is-danger my-2'
                onClick={deleteCommunity}
              >
                Delete Community
              </button>
            ) : isJoined ? (
              <button className='button is-danger my-2' onClick={leave}>
                Leave
              </button>
            ) : (
              <button onClick={join} className='button is-success my-2'>
                Join
              </button>
            )
          ) : (
            ''
          )}
        </div>
        {isAuthenticated && (isJoined || isAdmin) ? (
          <Link
            className='button button is-link mt-2'
            to={`/create/post/community/${community.name}`}
          >
            Create Post
          </Link>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert })(CommunityPage);
