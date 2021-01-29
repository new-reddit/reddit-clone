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
    <div className='form-container'>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Sign Up</h1>
        <label htmlFor='firstName'>First Name</label>
        <input
          type='text'
          name='firstName'
          placeholder='Enter your first name'
          value={firstName}
          onChange={handleChange}
        />
        {firstNameErrorMsg ? (
          <span className='error'>{firstNameErrorMsg}</span>
        ) : null}
        <label htmlFor='lastName'>Last Name</label>
        <input
          type='text'
          name='lastName'
          placeholder='Enter your last name'
          value={lastName}
          onChange={handleChange}
        />
        {lastNameErrorMsg ? (
          <span className='error'>{lastNameErrorMsg}</span>
        ) : null}
        <label htmlFor='userName'>User Name</label>
        <input
          type='text'
          name='userName'
          placeholder='Enter your User Name'
          value={userName}
          onChange={handleChange}
        />
        {userNameErrorMsg ? (
          <span className='error'>{userNameErrorMsg}</span>
        ) : null}

        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          placeholder='Enter your email address'
          value={email}
          onChange={handleChange}
        />
        {emailErrorMsg ? <span className='error'>{emailErrorMsg}</span> : null}
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          placeholder='Enter your password'
          value={password}
          onChange={handleChange}
        />
        {passwordErrorMsg ? (
          <span className='error'>{passwordErrorMsg}</span>
        ) : null}
        <button>Sign Up</button>
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
