import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../assets/spinner.gif';
import { Redirect, useParams } from 'react-router-dom';
import Posts from './Posts';
import Comments from './Comments';
import DashboardCommunities from '../DashboardCommunities';
import axios from 'axios';

const UserPage = ({ user: { loading, isAuthenticated } }) => {
  const [selected, setSelected] = useState('posts');
  const [profile, setProfile] = useState({});
  const userName = useParams().name;
  useEffect(async () => {
    if (localStorage.getItem('selected')) {
      setSelected(localStorage.getItem('selected'));
    }
    const res = await axios.get(`http://localhost:5000/u/${userName}`);
    setProfile(res.data.user);
  }, []);
  if (!isAuthenticated) {
    return <Redirect to='/login' />;
  }
  const handleClick = (e) => {
    if (e.target.innerText === 'Posts') {
      setSelected('posts');
      localStorage.setItem('selected', 'posts');
    } else if (e.target.innerText === 'Comments') {
      setSelected('comments');
      localStorage.setItem('selected', 'comments');
    } else if (e.target.innerText === 'Communities') {
      setSelected('communities');
      localStorage.setItem('selected', 'communities');
    }
  };
  const selectedView = () => {
    if (selected === 'posts') {
      return <Posts />;
    } else if (selected === 'comments') {
      return <Comments />;
    } else if (selected === 'communities') {
      return <DashboardCommunities />;
    }
  };
  return loading && profile === null ? (
    <img src={Spinner} alt='Loading' />
  ) : (
    <div className='container'>
      <div className='user'>
        <div className='user-info'>
          <p>
            <span>Name</span>: {profile.user_name}
          </p>
          <p>
            <span>Karma</span>: {profile.karma}
          </p>
          <p>
            <span>Joined at</span>: {profile.created_at}
          </p>
        </div>
      </div>
      <div className='dashboard-nav'>
        <ul>
          <li onClick={handleClick}>Posts</li>
          <li onClick={handleClick}>Comments</li>
          <li onClick={handleClick}>Communities</li>
        </ul>
      </div>
      {selectedView()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(UserPage);
