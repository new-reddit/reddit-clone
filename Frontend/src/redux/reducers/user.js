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
  profile: null,
  loading: true,
};

const user = (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        laoding: false,
      };
    case USER_LOAD_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        laoding: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        laoding: false,
        profile: null,
      };
    case USER_LOAD_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        laoding: false,
        profile: null,
      };
    case LOAD_USER_PROFILE:
      return {
        ...state,
        profile: payload,
        laoding: false,
      };
    default:
      return state;
  }
};

export default user;
