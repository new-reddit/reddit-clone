import { React, useState } from 'react';
import { connect } from 'react-redux';
import { register } from '../../redux/actions/user';
import { Link, Redirect } from 'react-router-dom';

const SignUp = ({ register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  });
  const [firstNameErrorMsg, setFirstNameErrorMsg] = useState('');
  const [lastNameErrorMsg, setLastNameErrorMsg] = useState('');
  const [userNameErrorMsg, setUserNameErrorMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const { firstName, lastName, userName, email, password } = formData;
  if (isAuthenticated) {
    return <Redirect to='/home' />;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(firstName, lastName, userName, email, password)) {
      register({ firstName, lastName, userName, email, password });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (firstName, lastName, userName, email, password) => {
    if (!firstName.length) {
      setFirstNameErrorMsg('First name is required');
      return false;
    }
    if (!lastName.length) {
      setLastNameErrorMsg('Last name is required');
      return false;
    }
    if (!userName.length) {
      setUserNameErrorMsg('User name is required');
      return false;
    }
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    if (!validEmailRegex.test(email)) {
      setEmailErrorMsg('Type a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setPasswordErrorMsg('Password must be 6 characters minimum.');
      return false;
    }
    return true;
  };

  return (
    <div className='container is-max-desktop mt-4 p-4'>
      <form onSubmit={handleSubmit} noValidate>
        <div className='field'>
          <label htmlFor='firstName' className='label'>
            First Name
          </label>
          <input
            className='input'
            type='text'
            name='firstName'
            placeholder='Enter your first name'
            value={firstName}
            onChange={handleChange}
          />
          {firstNameErrorMsg ? (
            <p className='has-text-danger help'>{firstNameErrorMsg}</p>
          ) : null}
        </div>
        <div className='field'>
          <label htmlFor='lastName' className='label'>
            Last Name
          </label>
          <input
            className='input'
            type='text'
            name='lastName'
            placeholder='Enter your last name'
            value={lastName}
            onChange={handleChange}
          />
          {lastNameErrorMsg ? (
            <p className='has-text-danger help'>{lastNameErrorMsg}</p>
          ) : null}
        </div>
        <div className='field'>
          <label htmlFor='userName' className='label'>
            User Name
          </label>
          <input
            className='input'
            type='text'
            name='userName'
            placeholder='Enter your User Name'
            value={userName}
            onChange={handleChange}
          />
          {userNameErrorMsg ? (
            <p className='has-text-danger help'>{userNameErrorMsg}</p>
          ) : null}
        </div>
        <div className='field'>
          <label htmlFor='email' className='label'>
            Email
          </label>
          <input
            className='input'
            type='email'
            name='email'
            placeholder='Enter your email address'
            value={email}
            onChange={handleChange}
          />
          {emailErrorMsg ? (
            <p className='has-text-danger help'>{emailErrorMsg}</p>
          ) : null}
        </div>
        <div className='field'>
          <label htmlFor='password' className='label'>
            Password
          </label>
          <input
            className='input'
            type='password'
            name='password'
            placeholder='Enter your password'
            value={password}
            onChange={handleChange}
          />
          {passwordErrorMsg ? (
            <p className='has-text-danger help'>{passwordErrorMsg}</p>
          ) : null}
        </div>
        <button className='button is-success'>Sign Up</button>
      </form>
      <p>
        Have an account? <Link to='/login'>Login</Link>
      </p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { register })(SignUp);
