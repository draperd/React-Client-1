import React from "react";
import auth from "../../utilities/Authentication";

class Logout extends React.Component {

   logout() {
      auth.logout();
      this.context.router.push("/login");
   }

   render() {
      return (
         <button className="mdl-button mdl-js-button mdl-button--icon"
                 onClick={this.logout.bind(this)}>
            <i className="material-icons">exit_to_app</i>
         </button>
      );
   }
}

Logout.contextTypes = {
    router: React.PropTypes.object
};

export default Logout;
