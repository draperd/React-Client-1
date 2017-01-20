import React from "react";
import { Link } from "react-router";
import auth from "alfresco-js-utils/lib/Authentication";
require("material-design-lite");

const App = React.createClass({
   getInitialState() {
      return {
         loggedIn: auth.loggedIn()
      }
   },

   updateAuth(loggedIn) {
      this.setState({
         loggedIn
      })
   },

   componentWillMount() {
      auth.onChange = this.updateAuth
      auth.login()
   },

   render() {
      return (
         <div>
            <ul>
               <li>
                  {this.state.loggedIn ? (
                     <Link to="/logout">Log out</Link>
                  ) : (
                     <Link to="/login">Sign in</Link>
                  )}
               </li>
               <li><Link to="/home">Home</Link>(authenticated)</li>
           </ul>
           {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
         </div>
      )
   }
})

export default App;