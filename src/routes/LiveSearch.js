import React from "react";

import Collection from "../components/containers/Collection";
import Content from "../components/layouts/Content";
import TableCell from "../components/renderers/TableCell";
import TableHeading from "../components/renderers/TableHeading";
import TableView from "../components/views/TableView";
import TableViewHead from "../components/views/TableViewHead";
import TableViewBody from "../components/views/TableViewBody";
import TableViewFoot from "../components/views/TableViewFoot";
import Thumbnail from "../components/renderers/Thumbnail";
import Property from "../components/renderers/Property";
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

                    <TableViewHead> 
                        <TableHeading label="Thumbnail" />
                        <TableHeading label="Name" orderById="name" />
                        <TableHeading label="Created By" orderById="createdByUser.displayName" />
                        <TableHeading label="Created On" orderById="createdAt" />
                    </TableViewHead>

                    <TableViewBody>
                        <TableCell>
                            <Thumbnail width="64px"></Thumbnail>
                        </TableCell>
                        <TableCell property="name" navigation={true} view={true}/>
                        <TableCell property="createdByUser.displayName" />
                        <TableCell>
                            <Property property="createdAt" renderAs="DATE"></Property>
                        </TableCell>
                    </TableViewBody>
                    
                    <TableViewFoot>
                        <TableCell colspan="4">
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