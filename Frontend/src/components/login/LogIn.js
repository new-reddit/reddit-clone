import { React, useState } from 'react';
import './login.styles.scss';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/user';
import { Link, Redirect } from 'react-router-dom';
 
const  LogIn = ({ login, isAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  if (isAuthenticated) {
    return <Redirect to="/dashboard"/>
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if(validate(email, password)) {
      login({ email, password });
    };
    setEmail('');
    setPassword('');
  };
  
  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
      setEmailErrorMsg('');
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
      setPasswordErrorMsg('');
    }
  };

  const validate = (email, password) =>  {
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
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
    <div className="container">
      <form onSubmit={handleSubmit} noValidate>
        <h1>Log In</h1>
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
        <button>Log In</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

export default connect(mapStateToProps, { login })(LogIn);
