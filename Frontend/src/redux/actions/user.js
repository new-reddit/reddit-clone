import { LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_FAIL, REGISTER_SUCCESS, LOG_OUT, USER_LOAD_FAIL, USER_LOAD_SUCCESS } from './types';
import axios from 'axios';
import { setToken } from '../../utils/setToken';
import { setAlert } from '../actions/alert';

export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const newUser = {
    email,
    password
  };
  try {
    const body = JSON.stringify(newUser);
    const res = await axios.post('http://localhost:5000/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    setToken(res.data.token);
  } catch (error) {
    dispatch(setAlert(error.response, 'danger'));
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const register = ({ name, email, password }) => async dispatch => {
  const user_name = name;
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const newUser = {
    user_name,
    email,
    password
  };
  try {
    const body = JSON.stringify(newUser);
    const res = await axios.post('http://localhost:5000/signup', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    setToken(res.data);
  } catch (error) {
    dispatch(setAlert(error.response, 'danger'));
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const logOut = () => dispatch => {
  console.log('logged out');
  if (localStorage.token) {
    localStorage.removeItem('token');
  }
  dispatch({
    type: LOG_OUT,
  });
};

export const loadUser = () => dispatch => {
  if (localStorage.token) {
    dispatch({
      type: USER_LOAD_SUCCESS
    });
  } else {
    dispatch({
      type: USER_LOAD_FAIL
    });
  }
};