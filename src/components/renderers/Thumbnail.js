import React from "react";
import { get } from "lodash";

class Thumbnail extends React.Component {

   render() {

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
      }

      return (
         <span>
            <img src={src} />
         </span>
      );
   }
}

export default Thumbnail;