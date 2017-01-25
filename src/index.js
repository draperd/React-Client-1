import React from "react";
import { render } from "react-dom";
import { browserHistory, Router, Route } from "react-router";

const auth = require("alfresco-js-utils/dist/Authentication");

import App from "./components/App";
import Login from "./components/Login";
import Logout from "./components/Logout";

import MainLayout from "./routes/MainLayout";
import Users from "./routes/Users";
import Nodes from "./routes/Nodes";

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
         <Route component={MainLayout}>
            <Route path="nodes" component={Nodes} onEnter={requireAuth} />
            <Route path="users" component={Users} onEnter={requireAuth} />
         </Route>
      </Route>
   </Router>
), document.getElementById('root'))
