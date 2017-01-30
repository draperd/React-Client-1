import React from "react";

import Menu from "../components/buttons/Menu";
import Collection from "../components/containers/Collection";
import Pagination from "../components/controls/Pagination";
import Toolbar from "../components/layouts/Toolbar";

import CreateMenuItem from "../components/menuitems/CreateMenuItem";

import BreadcrumbTrail from "../components/navigation/BreadcrumbTrail";
import TableCell from "../components/renderers/TableCell";
import TableHeading from "../components/renderers/TableHeading";
import Thumbnail from "../components/renderers/Thumbnail";
import TableView from "../components/views/TableView";
import TableViewHead from "../components/views/TableViewHead";
import TableViewBody from "../components/views/TableViewBody";
import TableViewFoot from "../components/views/TableViewFoot";

import Content from "../components/layouts/Content";

const Nodes = React.createClass({

   render() {
      return (
         <Content>
            <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" 
                        orderBy="name"
                        include="properties">
                  
                  <Toolbar>
                     <Menu label="Create...">
                        <CreateMenuItem label="Folder"></CreateMenuItem>
                     </Menu>

                  </Toolbar>

                  <BreadcrumbTrail/>
                  
                  <TableView>

                     <TableViewHead> 
                        <TableHeading label="Thumbnail" />
                        <TableHeading label="Name" orderById="name" />
                        <TableHeading label="Created By" orderById="createdByUser.displayName" />
                        <TableHeading label="Created On" orderById="createdAt" />
                        <TableHeading label="Is Folder"/>
                     </TableViewHead>

                     <TableViewBody>
                        <TableCell >
                           <Thumbnail></Thumbnail>
                        </TableCell>
                        <TableCell property="name" navigation={true} view={true}/>
                        <TableCell property="createdByUser.displayName" />
                        <TableCell property="createdAt" renderAs="DATE" />
                        <TableCell property="isFolder" />
                     </TableViewBody>
                     
                     <TableViewFoot>
                        <Pagination colspan="5"/>
                     </TableViewFoot>

                  </TableView>
               </Collection>

         </Content>
      );
   }
})

export default Nodes;