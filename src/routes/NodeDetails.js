import React from "react";

import Collection from "../components/containers/Collection";
import Item from "../components/containers/Item";
import Content from "../components/layouts/Content";
import Thumbnail from "../components/renderers/Thumbnail";
import Property from "../components/renderers/Property";
import Pagination from "../components/controls/Pagination";
import TableCell from "../components/renderers/TableCell";
import TableHeading from "../components/renderers/TableHeading";
import TableView from "../components/views/TableView";
import TableViewHead from "../components/views/TableViewHead";
import TableViewBody from "../components/views/TableViewBody";
import TableViewFoot from "../components/views/TableViewFoot";

class NodeDetails extends React.Component {

   render() {

      let commentsUrl = `/api/-default-/public/alfresco/versions/1/nodes/${this.props.params.id}/comments`;
      return (
         <Content>
            <Item>
               <Property property="name"></Property>
               <Thumbnail></Thumbnail>

               <Collection url={commentsUrl}>
                  <TableView>

                     <TableViewHead> 
                        <TableHeading label="Created By" orderById="createdBy.lastName" />
                        <TableHeading label="Created On" orderById="createdAt" />
                        <TableHeading label="Comment" />
                     </TableViewHead>

                     <TableViewBody>
                        <TableCell >
                           <Property property="createdBy.firstName"></Property>
                           <Property property="createdBy.lastName"></Property>
                        </TableCell>
                        <TableCell property="createdAt" renderAs="DATE" />
                        <TableCell property="content"/>
                     </TableViewBody>
                     
                     <TableViewFoot>
                        <Pagination colspan="3"/>
                     </TableViewFoot>

                  </TableView>

               </Collection>
            </Item>
         </Content>
      );
   }
}

export default NodeDetails;