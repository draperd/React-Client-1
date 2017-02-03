import React from "react";
import Collection from "../components/containers/Collection";
import Content from "../components/layouts/Content";

import Pagination from "../components/controls/Pagination";
import Delete from "../components/renderers/Delete";
import TableCell from "../components/renderers/TableCell";
import TableHeading from "../components/renderers/TableHeading";
import TableView from "../components/views/TableView";
import TableViewHead from "../components/views/TableViewHead";
import TableViewBody from "../components/views/TableViewBody";
import TableViewFoot from "../components/views/TableViewFoot";

const FilmStrip = React.createClass({

   render() {
      return (
         <Content>
            <Collection url="/api/-default-/public/alfresco/versions/1/sites" relations="containers,members">
               <TableView>

                  <TableViewHead> 
                     <TableHeading label="ID" />
                     <TableHeading label="Name" />
                     <TableHeading label="Actions" />
                  </TableViewHead>

                  <TableViewBody>
                     <TableCell property="id"/>
                     <TableCell property="title"/>
                     <TableCell>
                        <Delete url="/api/-default-/public/alfresco/versions/1/sites"></Delete>
                     </TableCell>

                  </TableViewBody>
                  
                  <TableViewFoot>
                     <TableCell colspan="3" >
                        <Pagination />
                     </TableCell>
                  </TableViewFoot>

               </TableView>
            </Collection>

         </Content>
      );
   }
})

export default FilmStrip;