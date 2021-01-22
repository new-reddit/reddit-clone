import React, { useEffect } from 'react';
import Header from './components/header/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Communities from './components/Communities';
import Home from './components/Home';
import LogIn from './components/login/LogIn';
import SignUp from './components/signup/SignUp';
import Alert from './components/alart/Alert';
import store from './redux/store';
import { Provider } from 'react-redux';
import { loadUser } from './redux/actions/user';
import './app.scss';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
    <Router>
      <Header />
      <Alert />
      <Switch>
          <Route path="/communities" exact component={Communities} />
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={SignUp} />
      </Switch>
    </Router>
    </Provider>
  );
}

export default App;
