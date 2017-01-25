import React from "react";
const auth = require("alfresco-js-utils/dist/Authentication");

const Logout = React.createClass({
   componentDidMount() {
      auth.logout()
   },

   render() {
      return <p>You are now logged out</p>;
   }
})

export default Logout;