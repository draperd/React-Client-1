import React from "react";

import LogoutButton from "../components/buttons/Logout";

import Layout from "../components/layouts/Layout";
import Header from "../components/layouts/Header";
import Drawer from "../components/layouts/Drawer";

const Users = React.createClass({

   render() {
      return (
         <Layout>
            <Header title="Alfresco Administration Console">
               <div className="mdl-layout-spacer"></div>
               <LogoutButton />
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