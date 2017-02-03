/**
 * @module
 */
import React from "react";

import LogoutButton from "../components/buttons/Logout";

import Layout from "../components/layouts/Layout";
import Header from "../components/layouts/Header";
import Drawer from "../components/layouts/Drawer";

/**
 * <p>This defines the main layout for the application. This is based on 
 * {@link https://material.io/guidelines/|Material Design} and
 * is implemented using {@link https://getmdl.io/|Material Design Lite}. The layout
 * comprises of a header (containing the a title and logout button) and a drawer
 * with links providing navigation around the application. You should edit this file 
 * to define the layout for your application (i.e. change the title and add additional 
 * links and actions).</p>
 *
 * <p>It is recommended that the child of this component is a 
 * [Content]{@link module:components/layouts/Content~Content} component as this contains the 
 * appropriate Material Design Lite CSS classes to maintain the Material Design layout.</p>
 * 
 * 
 * @class
 */
class MainLayout extends React.Component {

   /**
    * Renders the outer layout for the application that is shared by all the routes configured
    * in the index.js file.
    * 
    * @instance
    */
   render() {
      return (
         <Layout ref="componentNode">
            <Header title="Alfresco Administration Console">
               <div className="mdl-layout-spacer"></div>
               <LogoutButton />
            </Header>
         
            <Drawer title="Links">
               <a className="mdl-navigation__link" href="/nodes">Nodes</a>
               <a className="mdl-navigation__link" href="/livesearch">LiveSearch</a>
               <a className="mdl-navigation__link" href="/users">Users</a>
               <a className="mdl-navigation__link" href="/filmstrip">Filmstrip</a>
               <a className="mdl-navigation__link" href="/sites">Sites</a>
               <a className="mdl-navigation__link" href="/tags">Tags</a>
            </Drawer>

            {this.props.children}
         </Layout>
      )
   }
}

export default MainLayout;