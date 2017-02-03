import React from "react";
import Collection from "../components/containers/Collection";
import BreadcrumbTrail from "../components/navigation/BreadcrumbTrail";
import Property from "../components/renderers/Property";
import Thumbnail from "../components/renderers/Thumbnail";
import Carousel from "../components/views/Carousel";
import Content from "../components/layouts/Content";

const FilmStrip = React.createClass({

   render() {
      return (
         <Content>
            <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" 
                        orderBy="name"
                        include="properties">
                  
               <BreadcrumbTrail/>

               <Carousel frameHeight="300px">
                  <Property property="name" navigation={true}></Property>
                  <Thumbnail renditionId="imgpreview"></Thumbnail>
               </Carousel>
               
            </Collection>

         </Content>
      );
   }
})

export default FilmStrip;