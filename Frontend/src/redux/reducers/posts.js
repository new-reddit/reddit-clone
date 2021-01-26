import CREATE_POST from '../actions/types';

const initialState = [{}];

const post = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_POST:
      return {
        ...state,
        payload,
      };
  }
};
