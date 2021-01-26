import { React, useState, useEffect } from 'react';
import { FaBars, FaRegWindowClose } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { logOut } from '../../redux/actions/user';
import { connect } from 'react-redux';

const Header = ({ isAuthenticated, logOut }) => {
  const [open, setOpen] = useState(false);
  const openHamburgerMenu = (e) => {
    setOpen(true);
  };

  const closeHamburgerMenu = () => {
    setOpen(false);
  };

  return (
    <header className='header'>
      <div className='brand'>
        <a href='#'>Reddit Clone</a>
      </div>
      <FaBars onClick={openHamburgerMenu} className='hamburger-icon' />
      <ul className={`nav-menu ${open ? ' open' : ''}`}>
        <FaRegWindowClose
          onClick={closeHamburgerMenu}
          className={`hamburger-close ${open ? ' open' : ''}`}
        />
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/communities'>Communities</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <Link to='#!' onClick={logOut}>
              Log Out
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to='/signup'>Sign Up</Link>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});
export default connect(mapStateToProps, { logOut })(Header);
