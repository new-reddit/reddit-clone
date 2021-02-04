import { React, useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/user';
import { Link, Redirect } from 'react-router-dom';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const { email, password } = formData;
  if (isAuthenticated) {
    return <Redirect to='/home' />;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(email, password)) {
      login({ email, password });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (email, password) => {
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    if (!validEmailRegex.test(email)) {
      setEmailErrorMsg('Type a valid email address.');
      return 0;
    }
    if (password.length < 6) {
      setPasswordErrorMsg('Password must be 6 characters minimum.');
      return 0;
    }
    return 1;
  };

  return (
    <div className='container is-max-desktop mt-4 p-4'>
      <form onSubmit={handleSubmit} noValidate>
        <div className='field'>
          <label htmlFor='email' className='label'>
            Email
          </label>
          <div className='control'>
            <input
              className='input'
              type='email'
              name='email'
              placeholder='Enter your email address'
              value={email}
              onChange={handleChange}
            />
          </div>
          {emailErrorMsg ? (
            <p className='help has-text-danger'>{emailErrorMsg}</p>
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
            <p className='help has-text-danger'>{passwordErrorMsg}</p>
          ) : null}
        </div>
        <button className='button is-success'>Login</button>
      </form>
      <p>
        Don't have an account? <Link to='/signup'>Sign Up</Link>
      </p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
