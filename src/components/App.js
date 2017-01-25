import React from "react";
import auth from "../utilities/Authentication";
require("material-design-lite");

import BaseLayout from "./layouts/BaseLayout";

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
         <BaseLayout>
            {this.props.children}
         </BaseLayout>
      )
   }
})

export default App;