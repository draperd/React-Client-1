import React from "react";

import LogoutButton from "../components/buttons/Logout";

import Layout from "../components/layouts/Layout";
import Header from "../components/layouts/Header";
import Drawer from "../components/layouts/Drawer";

class MainLayout extends React.Component {

   render() {
      return (
         <Layout ref="componentNode">
            <Header title="Alfresco Administration Console">
               <div className="mdl-layout-spacer"></div>
               <LogoutButton />
            </Header>
         
            <Drawer title="Links">
               <a className="mdl-navigation__link" href="/nodes">Nodes</a>
               <a className="mdl-navigation__link" href="/users">Users</a>
               <a className="mdl-navigation__link" href="/filmstrip">Filmstrip</a>
            </Drawer>

            {this.props.children}
         </Layout>
      )
   }
}

export default MainLayout;