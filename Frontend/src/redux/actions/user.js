import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOG_OUT,
  USER_LOAD_FAIL,
  USER_LOAD_SUCCESS,
} from './types';
import axios from 'axios';
import { setToken } from '../../utils/setToken';
import { setUserName } from '../../utils/setUserName';
import { setAlert } from '../actions/alert';

export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const newUser = {
    email,
    password,
  };
  try {
    const body = JSON.stringify(newUser);
    const res = await axios.post('http://localhost:5000/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    setToken(res.data.token);
    setUserName(res.data.user_name);
    dispatch(loadUser());
  } catch (error) {
    dispatch(setAlert(error.response, 'danger'));
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const register = ({
  firstName,
  lastName,
  userName,
  email,
  password,
}) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const newUser = {
    first_name: firstName,
    last_name: lastName,
    user_name: userName,
    email,
    password,
  };
  try {
    const body = JSON.stringify(newUser);
    const res = await axios.post('http://localhost:5000/signup', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    setToken(res.data.token);
    setUserName(res.data.user_name);
    dispatch(loadUser());
  } catch (error) {
    dispatch(setAlert(error.response, 'danger'));
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const logOut = () => (dispatch) => {
  if (localStorage.token) {
    localStorage.removeItem('token');
  }
  if (localStorage.userName) {
    localStorage.removeItem('userName');
  }
  dispatch({
    type: LOG_OUT,
  });
};

export const loadUser = () => (dispatch) => {
  if (localStorage.getItem('token')) {
    axios.defaults.headers.common['x-auth-token'] = localStorage.getItem(
      'token'
    );
    dispatch({
      type: USER_LOAD_SUCCESS,
      payload: localStorage.getItem('token'),
    });
  } else {
    dispatch({
      type: USER_LOAD_FAIL,
    });
  }
};
