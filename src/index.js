import React from "react";
import { render } from "react-dom";
import { browserHistory, Router, Route } from "react-router";

import auth from "alfresco-js-utils/lib/Authentication";

import App from "./components/App";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";

import "material-design-lite/material.css";


function requireAuth(nextState, replace) {
   if (!auth.loggedIn()) {
      replace({
         pathname: "/login",
         state: { nextPathname: nextState.location.pathname }
      });
   }
}

render((
   <Router history={browserHistory}>
      <Route path="/" component={App}>
         <Route path="login" component={Login} />
         <Route path="logout" component={Logout} />
         <Route path="home" component={Home} onEnter={requireAuth} />
      </Route>
   </Router>
), document.getElementById('root'))
