import React from "react";

import Layout from "../components/layouts/Layout";
import Header from "../components/layouts/Header";
import Drawer from "../components/layouts/Drawer";

const Users = React.createClass({

   render() {
      return (
         <Layout>
            <Header title="Alfresco Administration Console">
               <div className="mdl-layout-spacer"></div>
               <button className="mdl-button mdl-js-button mdl-button--icon">
                 <i className="material-icons">exit_to_app</i>
               </button>
            </Header>
         
            <Drawer title="Links">
               <a className="mdl-navigation__link" href="/nodes">Nodes</a>
               <a className="mdl-navigation__link" href="/users">Users</a>
            </Drawer>

            {this.props.children}
         </Layout>
      )
   }
})

export default Users;