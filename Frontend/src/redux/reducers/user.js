import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOG_OUT,
  USER_LOAD_FAIL,
  USER_LOAD_SUCCESS,
} from '../actions/types';

const initialState = {
  isAuthenticated: null,
  token: null,
};

const user = (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
      };
    case USER_LOAD_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    case USER_LOAD_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default user;
