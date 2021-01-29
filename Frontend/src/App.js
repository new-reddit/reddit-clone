import React, { useEffect } from 'react';
import Header from './components/header/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AllCommunities from './components/AllCommunities';
import Home from './components/Home';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import Alert from './components/alart/Alert';
import UserPage from './components/dashboard/UserPage';
import CreateCommunity from './components/CreateCommunity';
import CreatePost from './components/CreatePost';
import store from './redux/store';
import { Provider } from 'react-redux';
import { loadUser } from './redux/actions/user';
import './app.scss';
import PostPage from './components/PostPage';
import CommunityPage from './components/CommunityPage';
import NotFound from './components/NotFound';

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
          <Route path='/communities' exact component={AllCommunities} />
          <Route path='/' exact component={Home} />
          <Route path='/login' exact component={Login} />
          <Route path='/signup' exact component={SignUp} />
          <Route path='/create-community' exact component={CreateCommunity} />
          <Route path='/u/:name' exact component={UserPage} />
          <Route path='/post/:id' exact component={PostPage} />
          <Route path='/community/:name' exact component={CommunityPage} />
          <Route
            path='/create/post/community/:name'
            exact
            component={CreatePost}
          />
          <Route path='/404' exact component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
