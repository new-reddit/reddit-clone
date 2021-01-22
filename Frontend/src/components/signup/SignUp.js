import { React, useState } from 'react';
import '../login/login.styles.scss';
import { connect } from 'react-redux';
import { register } from '../../redux/actions/user';
import { Link, Redirect } from 'react-router-dom';

const SignUp = ({ register, isAuthenticated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  if (isAuthenticated) {
    return <Redirect to="/dashboard"/>
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(name, email, password)) {
      register({ name, email, password });
    }
    setName('');
    setEmail('');
    setPassword('');
  };
  
  const handleChange = (e) => {
    if (e.target.name === 'name') {
      setName(e.target.value);
      setNameErrorMsg('');
    } else if (e.target.name === 'email') {
      setEmail(e.target.value);
      setEmailErrorMsg('');
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
      setPasswordErrorMsg('');
    }
  };

  const validate = (name, email, password) =>  {
    if (name.length < 6) {
      setNameErrorMsg('Name must be 6 characters minimum');
      return false;
    }
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
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
    <div className="container">
      <form onSubmit={handleSubmit} noValidate>
        <h1>Sign Up</h1>
        <label htmlFor="name">Name</label>
        <input 
          type="text"
          name="name"
          placeholder="Enter your name"
          value={name}
          onChange={handleChange}
        />
        {
          nameErrorMsg ? <span className="error">{nameErrorMsg}</span> : null
        }
        <label htmlFor="email">Email</label>
        <input 
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleChange}
        />
        {
          emailErrorMsg ? <span className="error">{emailErrorMsg}</span> : null
        }
        <label htmlFor="password">Password</label>
        <input 
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={handleChange}
        />
        {
          passwordErrorMsg ? <span className="error">{passwordErrorMsg}</span> : null
        }
        <button>Sign Up</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

export default connect(mapStateToProps, { register })(SignUp);
