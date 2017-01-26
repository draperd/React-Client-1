import React from "react";
import Collection from "../components/containers/Collection";
import Property from "../components/renderers/Property";
import Carousel from "../components/views/Carousel";
import Content from "../components/layouts/Content";

const FilmStrip = React.createClass({

   render() {
      return (
         <Content>
            <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" 
                        orderBy="name"
                        include="properties">
                  
                  <Carousel>
                     <Property property="name"></Property>
                  </Carousel>
                  
               </Collection>

         </Content>
      );
   }
})

export default FilmStrip;