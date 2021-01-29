import { React, useState, useEffect } from 'react';
import { FaBars, FaRegWindowClose } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { logOut } from '../../redux/actions/user';
import { connect } from 'react-redux';
import logo from '../../assets/logo.png';

const Header = ({ isAuthenticated, logOut, userName }) => {
  const toggleMenu = () => {
    document.querySelector('.navbar-brand').classList.toggle('is-active');
    document.querySelector('.navbar-menu').classList.toggle('is-active');
  };

  return (
    <nav
      className='navbar'
      role='navigation'
      aria-label='main navigation'
      style={{ background: '#0D335D' }}
    >
      <div className='container'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/home'>
            <img src={logo} alt='Placeholder logo' className='mr-1' />
          </Link>
          <Link
            onClick={toggleMenu}
            role='button'
            className='navbar-burger'
            aria-label='menu'
            aria-expanded='false'
            data-target='navbarBasicExample'
            style={{ color: '#fff' }}
          >
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
          </Link>
        </div>
        <div className='navbar-menu' style={{ background: '#0D335D' }}>
          <div className='navbar-start'>
            <div className='navbar-item'>
              <Link to='/home' className='has-text-white'>
                Home
              </Link>
            </div>
            <div className='navbar-item'>
              <Link to='/communities' className='has-text-white'>
                Communities
              </Link>
            </div>
          </div>
          <div className='navbar-end'>
            <div className='navbar-item'>
              {isAuthenticated ? (
                <div className='buttons'>
                  <Link to={`/u/${userName}`} className='button is-primary'>
                    Dashboard
                  </Link>
                  <button onClick={logOut} className='button is-danger'>
                    Log out
                  </button>
                </div>
              ) : (
                <div className='buttons'>
                  <Link to='/signup' className='button is-primary'>
                    Sign Up
                  </Link>
                  <Link to='/login' className='button is-light'>
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  userName: state.user.userName,
});
export default connect(mapStateToProps, { logOut })(Header);
