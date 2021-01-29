import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOG_OUT,
  USER_LOAD_FAIL,
  USER_LOAD_SUCCESS,
  LOAD_USER_PROFILE,
} from '../actions/types';

const initialState = {
  isAuthenticated: null,
  token: null,
  userName: null,
  loading: true,
};

const user = (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        userName: payload.user_name,
        isAuthenticated: true,
        loading: false,
      };
    case USER_LOAD_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        loading: false,
        userName: null,
      };
    case USER_LOAD_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        userName: null,
      };
    default:
      return state;
  }
};

export default user;
