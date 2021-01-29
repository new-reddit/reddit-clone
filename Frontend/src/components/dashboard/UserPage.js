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
  }, [userName]);
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
    <div className='container p-4'>
      <div className='card has-background-grey-lighter'>
        <div className='card-content'>
          <p className='title'>
            {profile.first_name + ' ' + profile.last_name}{' '}
          </p>
          <p className='subtitle'>@{profile.user_name}</p>
          <p className='subtitle'>
            <span className='has-text-weight-bold'>Karma: </span>
            {profile.karma}
          </p>
          <p className='subtitle'>
            <span className='has-text-weight-bold'>Joined at: </span>
            {profile.created_at}
          </p>
        </div>
      </div>
      <div className='buttons mt-2'>
        <button className='button is-link' onClick={handleClick}>
          Posts
        </button>
        <button className='button is-link' onClick={handleClick}>
          Comments
        </button>
        <button className='button is-link' onClick={handleClick}>
          Communities
        </button>
      </div>
      {selectedView()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(UserPage);
