import React from "react";
import { render } from "react-dom";
import { browserHistory, Router, Route, IndexRoute } from "react-router";

// Importing Material Design Lite CSS and JS dependencies to provide the UX for
// the application...
import "material-design-lite/material.css";
require("material-design-lite");

import auth from "./utilities/Authentication";

// This Component is used to handle user login...
import Login from "./routes/Login";

// This Component provides the main layout for the application, this comprises of
// the header and drawer. All other routers are nested within this layout to avoid
// code duplication...
import MainLayout from "./routes/MainLayout";

// These Components represent the routes available for authenticated users within
// the application. These are each nested within the MainLayout and are mapped to
// specific paths...
import Users from "./routes/Users";
import Nodes from "./routes/Nodes";
import NodeDetails from "./routes/NodeDetails";
import FilmStrip from "./routes/FilmStrip";
import Sites from "./routes/Sites";
import Tags from "./routes/Tags";
import LiveSearch from "./routes/LiveSearch";
import Search from "./routes/Search";

// A simple function used to ensure that the main routes cannot be accessed by 
// unauthenticated users. If the user is not logged in then they will be automatically
// redirected to the login page...
function requireAuth(nextState, replace) {
   if (!auth.loggedIn()) {
      replace({
         pathname: "/login",
         state: { nextPathname: nextState.location.pathname }
      });
   }
}

// This sets up the routes for the application...
// You can add your own routes within the MainLayout (if you want a link to your route
// to appear in the navigation drawer then you should edit MainLayout.js to add the link)....
render((
   <Router history={browserHistory}>
      <Route path="login" component={Login} />
      <Route path="/" component={MainLayout} onEnter={requireAuth}>
         <IndexRoute component={Nodes} onEnter={requireAuth} />
         <Route path="nodes" component={Nodes} onEnter={requireAuth} />
         <Route path="livesearch" component={LiveSearch} onEnter={requireAuth} />
         <Route path="users" component={Users} onEnter={requireAuth} />
         <Route path="filmstrip" component={FilmStrip} onEnter={requireAuth} />
         <Route path="sites" component={Sites} onEnter={requireAuth} />
         <Route path="tags" component={Tags} onEnter={requireAuth} />
         <Route path="search" component={Search} onEnter={requireAuth} />
         <Route path="node/:id" component={NodeDetails} onEnter={requireAuth} />
      </Route>
   </Router>
), document.getElementById('root'))
