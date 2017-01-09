import React from "react";
import auth from "alfresco-js-utils/lib/Authentication";

const Logout = React.createClass({
   componentDidMount() {
      auth.logout()
   },

   render() {
      return <p>You are now logged out</p>;
   }
})

export default Logout;