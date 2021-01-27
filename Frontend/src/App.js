import React, { useEffect } from 'react';
import Header from './components/header/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Communities from './components/Communities';
import Home from './components/Home';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import Alert from './components/alart/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import store from './redux/store';
import { Provider } from 'react-redux';
import { loadUser } from './redux/actions/user';
import './app.scss';
import PostPage from './components/PostPage';

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
          <Route path='/communities' exact component={Communities} />
          <Route path='/' exact component={Home} />
          <Route path='/login' exact component={Login} />
          <Route path='/signup' exact component={SignUp} />
          <PrivateRoute path='/dashboard' exact component={Dashboard} />
          <Route path='/post/:id' exact component={PostPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
