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

   componentDidMount() {
      window.componentHandler.upgradeElement(this.refs.componentNode);
   },

   render() {
      return (
         <div ref="componentNode" className="mdl-layout__container">
            <div className="mdl-layout mdl-js-layout">
               <header className="mdl-layout__header ">
                  <div className="mdl-layout__header-row" >
                     <span className="mdl-layout-title">Alfresco Administration Console</span>
                     <div className="mdl-layout-spacer"></div>
                     <button className="mdl-button mdl-js-button mdl-button--icon">
                       <i className="material-icons">exit_to_app</i>
                     </button>
                  </div>
               </header>
               <div className="mdl-layout__drawer">
                  <span className="mdl-layout-title">Navigation</span>
                  <nav className="mdl-navigation">
                     <a className="mdl-navigation__link" href="">Users</a>
                     <a className="mdl-navigation__link" href="">Groups</a>
                  </nav>
               </div>
               <main className="mdl-layout__content">
                  <div className="page-content" data-dojo-attach-point="contentNode">
                     {this.props.children}
                  </div>
               </main>
            </div>
         </div>
      )
   }
})

export default App;