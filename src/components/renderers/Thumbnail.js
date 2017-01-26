import React from "react";
import { get } from "lodash";

class Thumbnail extends React.Component {

   render() {

      let thumbnail;
      if (this.props.item.entry.isFolder)
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
            src = `/api/-default-/public/alfresco/versions/1/nodes/${this.props.item.entry.id}/renditions/${renditionId}/content?&alf_ticket=${localStorage.ticket}`;
            thumbnail = <img src={src} role="presentation" />
         }
         else
         {
            thumbnail = <i className="material-icons">insert_drive_file</i>;
         }
         
      }

      return (
         <span>{thumbnail}</span>
      );
   }
}

export default Thumbnail;