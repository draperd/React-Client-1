import React from "react";
import Search from "../components/containers/Search";
import Content from "../components/layouts/Content";
import TableCell from "../components/renderers/TableCell";
import TableHeading from "../components/renderers/TableHeading";
import Thumbnail from "../components/renderers/Thumbnail";
import Property from "../components/renderers/Property";
import Delete from "../components/renderers/Delete";
import TableView from "../components/views/TableView";
import TableViewHead from "../components/views/TableViewHead";
import TableViewBody from "../components/views/TableViewBody";
import TableViewFoot from "../components/views/TableViewFoot";
import Pagination from "../components/controls/Pagination";
import Filter from "../components/controls/Filter";

const SearchScreen = React.createClass({

   render() {
      return (
         <Content>
            <Search>
               <Filter />
               <TableView>

                  <TableViewHead> 
                     <TableHeading label="Thumbnail" />
                     <TableHeading label="Name" orderById="name" />
                     <TableHeading label="Created By" orderById="createdByUser.displayName" />
                     <TableHeading label="Created On" orderById="createdAt" />
                     <TableHeading label="Is Folder"/>
                     <TableHeading/>
                  </TableViewHead>

                  <TableViewBody>
                     <TableCell >
                        <Thumbnail width="64px"></Thumbnail>
                     </TableCell>
                     <TableCell property="name" navigation={true} view={true}/>
                     <TableCell property="createdByUser.displayName" />
                     <TableCell>
                        <Property property="createdAt" renderAs="DATE"></Property>
                     </TableCell>
                     <TableCell property="isFolder" />
                     
                     <TableCell>
                        <Delete url="/api/-default-/public/alfresco/versions/1/nodes/" />
                     </TableCell>

                  </TableViewBody>
                  
                  <TableViewFoot>
                     <TableCell colspan="6">
                        <Pagination />
                     </TableCell>
                  </TableViewFoot>

               </TableView>
               
               
            </Search>

         </Content>
      );
   }
})

export default SearchScreen;