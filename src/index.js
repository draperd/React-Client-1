import React from "react";
import { render } from "react-dom";
import { browserHistory, Router, Route, IndexRoute } from "react-router";

const auth = require("alfresco-js-utils/dist/Authentication");

import Login from "./components/Login";
import MainLayout from "./routes/MainLayout";
import Users from "./routes/Users";
import Nodes from "./routes/Nodes";
import FilmStrip from "./routes/FilmStrip";

import "material-design-lite/material.css";
require("material-design-lite");


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
      <Route path="login" component={Login} />
      <Route path="/" component={MainLayout} onEnter={requireAuth}>
         <IndexRoute component={Nodes} onEnter={requireAuth} />
         <Route path="nodes" component={Nodes} onEnter={requireAuth} />
         <Route path="users" component={Users} onEnter={requireAuth} />
         <Route path="filmstrip" component={FilmStrip} onEnter={requireAuth} />
      </Route>
   </Router>
), document.getElementById('root'))
