import React from "react";
import Collection from "../components/containers/Collection";
import Content from "../components/layouts/Content";

import Pagination from "../components/controls/Pagination";
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
            <Collection url="/api/-default-/public/alfresco/versions/1/tags">
               <TableView>

                     <TableViewHead> 
                        <TableHeading label="Name" />
                     </TableViewHead>

                     <TableViewBody>
                        <TableCell property="tag"/>
                     </TableViewBody>
                     
                     <TableViewFoot>
                        <TableCell colspan="1" >
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