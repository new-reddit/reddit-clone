import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadUserProfile } from '../../redux/actions/user';
import person from './person.png';
import Spinner from '../../assets/spinner.gif';
import { Redirect, button } from 'react-router-dom';
import Posts from './Posts';
import Comments from './Comments';
import Communities from '../Communities';

const Dashboard = ({
  loadUserProfile,
  user: { loading, isAuthenticated, profile },
}) => {
  const [selected, setSelected] = useState('posts');
  useEffect(() => {
    loadUserProfile();
  }, []);
  if (!isAuthenticated) {
    return <Redirect to='/login' />;
  }
  console.log(profile);
  const handleClick = (e) => {
    if (e.target.innerText === 'Posts') {
      setSelected('posts');
    } else if (e.target.innerText === 'Comments') {
      setSelected('comments');
    } else if (e.target.innerText === 'Communities') {
      setSelected('communities');
    }
  };

  const selectedView = () => {
    if (selected === 'posts') {
      return <Posts />;
    } else if (selected === 'comments') {
      return <Comments />;
    } else if (selected === 'communities') {
      return <Communities />;
    }
  };
  return loading && profile === null ? (
    <img src={Spinner} alt='Loading' />
  ) : (
    <div className='container'>
      <div className='user'>
        <img src={person} alt='User Image' />
        <div className='user-info'>
          <p>
            <span>Name</span>: {profile.user.user_name}
          </p>
          <p>
            <span>Karma</span>: 20
          </p>
          <p>
            <span>Joined at</span>: {profile.user.created_at}
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

export default connect(mapStateToProps, { loadUserProfile })(Dashboard);
