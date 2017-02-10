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
    * @param {object} props
    * @param {string} [props.width="100%"] The width of the thumbnail
    */
   constructor(props) {
      super(props);
      this.width = props.width || "100%";
      this.height = props.height;
   }

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
         thumbnail = 
            <svg className="components_renderers_Thumbnail__img" 
                 width={this.width} 
                 height={this.width}
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 16 16"
                 style={ { width: this.width } }>
            <path fill="#000000" d="M7 2l2 2h7v11h-16v-13z"></path>
         </svg>;
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
            thumbnail = <div style={{width: this.width, height: this.height||"auto", overflow: "hidden", display: "flex"}}>
                            <img className="components_renderers_Thumbnail__img"
                                 width={this.width}
                                 src={src} 
                                 role="presentation" />
                        </div>
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
            
            thumbnail = <svg className="components_renderers_Thumbnail__img" 
                             width={this.width} 
                             height={this.width}
                             xmlns="http://www.w3.org/2000/svg"
                             viewBox="-1 0 18 16"
                             style={ { width: "100%" } }>
               <path fill="#000000" d="M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"></path>
            </svg>;
         }
      }

      return (
         <span className="components_renderers_Thumbnail">{thumbnail}</span>
      );
   }
}

export default Thumbnail;