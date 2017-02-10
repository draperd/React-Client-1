import React from "react";

import Collection from "../components/containers/Collection";
import Content from "../components/layouts/Content";
import TableCell from "../components/renderers/TableCell";
import TableView from "../components/views/TableView";
import TableViewBody from "../components/views/TableViewBody";
import TableViewFoot from "../components/views/TableViewFoot";
import Thumbnail from "../components/renderers/Thumbnail";
import Line from "../components/renderers/Line";
import Pagination from "../components/controls/Pagination";
import Filter from "../components/controls/Filter";
import DebouncedFilter from "../components/controls/DebouncedFilter";

import "./css/PageContent.css";

class LiveSearch extends React.Component {

   render() {
      let DBFilter = DebouncedFilter(Filter);
      return (
         <Content>
            <Collection skipCount={0}
                        maxItems={10}
                        filterUrl="/api/-default-/public/alfresco/versions/1/queries/nodes" 
                        include="properties"
                        useHash="true">
                <DBFilter focus="true"/>
                <TableView>

                    <TableViewBody>
                        <TableCell>
                            <Thumbnail width="48px" height="48px"></Thumbnail>
                        </TableCell>
                        <TableCell>
                            <Line style={{fontWeight: "bold"}} property="name" navigation={true} view={true} />
                            <Line label="Created by:" property="createdByUser.displayName" />
                            <Line label="Created on:" property="createdAt" renderAs="DATE"/>
                            <Line label="Size:" property="content.sizeInBytes" renderAs="SIZE" />
                        </TableCell>
                    </TableViewBody>
                    
                    <TableViewFoot>
                        <TableCell colspan="2">
                            <Pagination />
                        </TableCell>
                    </TableViewFoot>

                </TableView>
                
            </Collection>
         </Content>
      );
   }
}

export default LiveSearch;