import React from 'react';
import { connect } from 'react-redux';
import person from './person.png';

const Dashboard = () => {
  return (
    <div className='container'>
      <div className='user'>
        <img src={person} alt='User Image' />
        <div className='user-info'>
          <p>
            <span>Name</span>: Ahmed Adel
          </p>
          <p>
            <span>Karma</span>: 20
          </p>
          <p>
            <span>Joined at</span>: 1-2-2020
          </p>
        </div>
      </div>
      <div className='dashboard-nav'>
        <ul>
          <li>
            <a href='#'>Posts</a>
          </li>
          <li>
            <a href='#'>Comments</a>
          </li>
          <li>
            <a href='#'>Communities</a>
          </li>
        </ul>
      </div>
      <div className='posts'>
        <div className='post'>
          <div className='post-header'>
            <div className='voting'>
              <i className='fa fa-arrow-up'></i>
              <p>8</p>
              <i className='fa fa-arrow-down'></i>
              <i></i>
            </div>
            <div className='post-info'>
              <a href='#' className='title'>
                Test
              </a>
              <div className='post-meta-info'>
                <p>
                  <i className='fa fa-user'></i> Ahmed Adel
                </p>
                <p>
                  <i className='fa fa-clock'></i> 6 Hours
                </p>
                <p>
                  <i className='fa fa-align-justify'></i> Web Development
                </p>
                <p>
                  <i className='fa fa-comment'></i> 19 Comments
                </p>
              </div>
            </div>
          </div>
          <div className='post-body'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure
            quisquam natus, atque necessitatibus quis dicta incidunt ipsa
            architecto vitae corporis ipsam expedita explicabo error accusamus?
          </div>
        </div>
        <div className='post'>
          <div className='post-header'>
            <div className='voting'>
              <i className='fa fa-arrow-up'></i>
              <p>8</p>
              <i className='fa fa-arrow-down'></i>
              <i></i>
            </div>
            <div className='post-info'>
              <a href='#' className='title'>
                Test
              </a>
              <div className='post-meta-info'>
                <p>
                  <i className='fa fa-user'></i> Ahmed Adel
                </p>
                <p>
                  <i className='fa fa-clock'></i> 6 Hours
                </p>
                <p>
                  <i className='fa fa-align-justify'></i> Web Development
                </p>
                <p>
                  <i className='fa fa-comment'></i> 19 Comments
                </p>
              </div>
            </div>
          </div>
          <div className='post-body'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure
            quisquam natus, atque necessitatibus quis dicta incidunt ipsa
            architecto vitae corporis ipsam expedita explicabo error accusamus?
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(Dashboard);
