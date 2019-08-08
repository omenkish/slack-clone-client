import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';
import DirectMessages from './DirectMessages';
import PrivateRoute from '../utils/protectRoute';

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/view-team/:teamId?/:channelId?" exact component={ViewTeam} />
      <PrivateRoute path="/view-team/user/:teamId/:userId" exact component={DirectMessages} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
    </Switch>
  </Router>
);
