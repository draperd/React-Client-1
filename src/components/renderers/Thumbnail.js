/**
 * @module
 */
import React from "react";
import { get } from "lodash";
import xhr from "../../utilities/Xhr";
import "./css/Thumbnail.css";

/**
 * @class
 */
class Thumbnail extends React.Component {

   /**
    * 
    * @instance
    * @return {JSX}
    */
   render() {

      let thumbnail;
      let id = get(this.props, "item.entry.id", "");
      if (!id)
      {
         // Don't do anything without an id!
      }
      else if (this.props.item.entry.isFolder)
      {
         thumbnail = <i className="material-icons">folder</i>;
      }
      else
      {
         let renditionId = this.props.renditionId || "doclib";
         
         let hasRendition = false;
         let renditionData = get(this.props.item.entry, "properties.cm:lastThumbnailModification", "");
         if (renditionData)
         {
            hasRendition = renditionData.some(function(rendition) {
               return rendition.indexOf(renditionId) > -1;
            }, this);
         }

         let src = "";
         if (hasRendition)
         {
            src = `/api/-default-/public/alfresco/versions/1/nodes/${id}/renditions/${renditionId}/content?&alf_ticket=${localStorage.ticket}`;
            thumbnail = <img className="components_renderers_Thumbnail__img"
                             src={src} 
                             role="presentation" />
         }
         else
         {
            if (id)
            {
               xhr.post(`/api/-default-/public/alfresco/versions/1/nodes/${id}/renditions`, {
                  id: renditionId
               }).catch(() => {
                  console.info("Ignore the 404");
               });
            }
            
            thumbnail = <i className="material-icons">insert_drive_file</i>;
         }
         
      }

      return (
         <span className="components_renderers_Thumbnail">{thumbnail}</span>
      );
   }
}

export default Thumbnail;