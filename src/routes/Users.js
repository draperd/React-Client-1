import React from "react";

import CreateUserButton from "../components/buttons/CreateUserButton";
import Collection from "../components/containers/Collection";
import Filter from "../components/controls/Filter";
import UserTableView from "../components/views/UserTableView";
import Content from "../components/layouts/Content";
import Toolbar from "../components/layouts/Toolbar";

const Users = React.createClass({

   render() {
      return (
         <Content>
            <Collection url="/api/-default-/public/alfresco/versions/1/people"
                        filterUrl="/api/-default-/public/alfresco/versions/1/queries/people"
                        skipCount={0}
                        maxItems={10}
                        orderBy="firstName"
                        orderDirection="DESC">
               <Toolbar>
                  <CreateUserButton/>
               </Toolbar>
               <Filter />
               <UserTableView />
            </Collection>

         </Content>
      );
   }
})

export default Users;