import React from "react";

import CreateUserButton from "../components/buttons/CreateUserButton";
import Collection from "../components/containers/Collection";
import Filter from "../components/controls/Filter";
import UserTableView from "../components/views/UserTableView";
import Content from "../components/layouts/Content";

const Users = React.createClass({

   render() {
      return (
         <Content>
            <Collection skipCount={0}
                        maxItems={10}
                        orderBy="firstName"
                        orderDirection="DESC">
               <CreateUserButton/>
               <Filter />
               <UserTableView />
            </Collection>

         </Content>
      );
   }
})

export default Users;