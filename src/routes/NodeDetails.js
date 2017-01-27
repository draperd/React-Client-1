import React from "react";

import Item from "../components/containers/Item";
import Content from "../components/layouts/Content";
import Thumbnail from "../components/renderers/Thumbnail";
import Property from "../components/renderers/Property";

class NodeDetails extends React.Component {

   render() {
      return (
         <Content>
            <Item>
               <Property property="name"></Property>
               <Thumbnail></Thumbnail>
            </Item>
         </Content>
      );
   }
}

export default NodeDetails;