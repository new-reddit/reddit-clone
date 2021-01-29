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
    history.push('/');
  };
  return (
    <div className='container'>
      <div className='community-container'>
        <div className='community-posts'>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        <div>
          <div className='community-info'>
            <h2>{community.title}</h2>
            <p>{community.description}</p>
            <p>
              <span>Number Of Members: </span> {community.members_count}
            </p>
            {isAdmin ? (
              <button
                onClick={deleteCommunity}
                style={{ background: '#CF4155' }}
              >
                Delete Community
              </button>
            ) : isAuthenticated && isJoined ? (
              <button onClick={leave}>Leave</button>
            ) : (
              <button onClick={join}>Join</button>
            )}
          </div>
          {isAuthenticated && (isJoined || isAdmin) ? (
            <Link
              className='create-post'
              to={`/create/post/community/${community.name}`}
            >
              Create Post
            </Link>
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

export default connect(mapStateToProps, { setAlert })(CommunityPage);
