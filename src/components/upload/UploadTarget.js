/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";
import { collectionEvents } from "../containers/Collection";
import { merge, clone } from "lodash";

const uploadState = {
   ADDED: "added",
   FAILURE: "failure",
   SUCCESS: "success"
};

/**
 *
 * @class
 */
class UploadTarget extends React.Component {

   /**
    * 
    * @constructor
    * @param {object} props
    * @param {string} [url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children"] The URL to upload content to
    */
   constructor(props) {
      super(props);
      this.url = props.url || "/api/-default-/public/alfresco/versions/1/nodes/-root-/children";

      this.fileStore = {};

      this._numUploadsInProgress = 0;
      this.totalNewUploads = 0;

   }

   componentDidMount() {
      this.supportsDNDUpload = ("draggable" in document.createElement("span"));
      this.addUploadSuport();
   }

   addUploadSuport() {
      if (this.supportsDNDUpload)
      {
         this.dndUploadEnabled = true;
         this.refs.componentNode.addEventListener("drop", this.onDrop.bind(this));
         this.refs.componentNode.addEventListener("dragenter", this.onDragEnter.bind(this));
         this.refs.componentNode.addEventListener("dragover", this.onDragOver.bind(this));
      }
   }

   removeUploadSupport() {

   }

   onDragEnter(event) {
      console.info("Drag enter");
   }

   onDragOver(event) {
      console.info("Drag over");
      event.stopPropagation();
      event.preventDefault();
   }

   onDrop(event) {
      console.info("Drop event !");
      try 
      {
         // Only perform a file upload if the user has *actually* dropped some files!
         if (event.dataTransfer.files !== undefined && 
             event.dataTransfer.files !== null && 
             event.dataTransfer.files.length > 0)
         {
            let destination = this._currentNode ? this._currentNode.nodeRef : null;
            let defaultConfig = {
               destination: destination,
               siteId: null,
               containerId: null,
               uploadDirectory: null,
               description: "",
               overwrite: false,
               thumbnails: "doclib",
               username: null,
               relativePath: this.props.relativePath || "/"
            };
            this.onUploadRequest({
               files: event.dataTransfer.files,
               targetData: defaultConfig
            });
         }
         else
         {
            // Error handling?
         }
      }
      catch(exception)
      {
         
      }

      event.stopPropagation();
      event.preventDefault();
   }

   onUploadRequest(input) {

      // Make sure we have enough information to continue
      if (input.files && input.targetData) 
      {
         this.totalNewUploads += input.files.length;
         this.startUploads(input);
      }
   }

   constructUploadData(input) {
      return {
         filedata: input.file,
         filename: input.fileName,
         destination: input.targetData.destination,
         siteId: input.targetData.siteId,
         containerId: input.targetData.containerId,
         relativePath: this.props.relativePath || "/",
         majorVersion: input.targetData.majorVersion ? input.targetData.majorVersion : "true",
         updateNodeRef: input.targetData.updateNodeRef,
         description: input.targetData.description,
         overwrite: input.targetData.overwrite,
         thumbnails: input.targetData.thumbnails,
         username: input.targetData.username
      };
   }

   createUploadRequest(input) {
      // Add the data to the upload property of XMLHttpRequest so that we can determine which file each
      // progress update relates to (the event argument passed in the progress function does not contain
      // file name details)
      let request = new XMLHttpRequest();
      request.upload._fileData = input.fileId;

      // Add the event listener functions to the upload properties of the XMLHttpRequest object
      request.upload.addEventListener("progress", (event) => this.uploadProgressListener(input.fileId, event));
      request.upload.addEventListener("load", (event) => this.successListener(input.fileId, event));
      request.upload.addEventListener("error", (event) => this.failureListener(input.fileId, event));
      request.upload.addEventListener("abort", (event) => this.failureListener(input.fileId, event));

      // Construct an object containing the data required for file upload
      // Note that we use .name and NOT .fileName which is non-standard and will break FireFox 7
      let uploadData = this.constructUploadData({
         file: input.file, 
         fileName: input.file.name, 
         targetData: input.targetData
      });

      // Add the upload data to the file store
      this.fileStore[input.fileId] = {
         state: uploadState.ADDED,
         fileName: input.file.name,
         uploadData: uploadData,
         request: request,
         progress: 0
      };
   }


   startUploads(input) {

      Object.keys(input.files).forEach(function(key) {
         // Ensure a unique file ID
         let fileId = Date.now();
         while (this.fileStore.hasOwnProperty(fileId)) 
         {
            fileId = Date.now();
         }

         this.createUploadRequest({
            fileId: fileId,
            file: input.files.item(key),
            targetData: input.targetData
         });
      }, this);
      
      // Start uploads
      this.spawnFileUploads();
   }


   spawnFileUploads() {
      Object.keys(this.fileStore).forEach(function(fileId) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo.state === uploadState.ADDED) {
            this.startFileUpload(fileInfo);
         }
      }, this);
   }

   startFileUpload(fileInfo) {
      // TODO: Ensure we only upload the maximum allowed at a time

      this._numUploadsInProgress++;

      fileInfo.state = this.STATE_UPLOADING;

      let formData = new FormData();
      let uploadData = fileInfo.uploadData;
      
      // Set-up the form data object
      formData.append("fileData", uploadData.filedata);
      formData.append("fileName", uploadData.filename);
      formData.append("autoRename", !uploadData.overwrite);

      if (uploadData.thumbnails) 
      {
         formData.append("renditions", uploadData.thumbnails);
      }
      if (uploadData.relativePath) 
      {
         formData.append("relativePath", uploadData.relativePath);
      }
      
      fileInfo.request.open("POST", this.url, true);
      fileInfo.request.send(formData);
   }

   uploadProgressListener(fileId, event) {
      let fileInfo = this.fileStore[fileId];
      if (fileInfo && event.lengthComputable) 
      {
         var progress = Math.min(Math.round(event.loaded / event.total * 100), 100);
         // this.uploadDisplayWidget.updateUploadProgress(fileId, progress);
         fileInfo.progress = progress;
         this.updateAggregateProgress();
      } 
      else 
      {
         console.warn("Unable to update upload progress for file (evt,file)", event, fileInfo);
      }
   }

   successListener(fileId, event) {
      let fileInfo = this.fileStore[fileId];
      if (fileInfo) {
         // NOTE: There is an occasional timing issue where the upload completion event fires before the
         // readyState is correctly updated. This means that we can't check the upload actually completed
         // successfully, if this occurs then we'll attach a function to the onreadystatechange extension
         // point and things to catch up before we check everything was ok.
         if (fileInfo.request.readyState !== 4) 
         {
            // this.uploadDisplayWidget.updateUploadProgress(fileId, 100);
            fileInfo.request.onreadystatechange = () => {
               if (fileInfo.request.readyState === 4) 
               {
                  this.processUploadCompletion(fileId, event);
               }
            };
         } 
         else 
         {
            this.processUploadCompletion(fileId, event);
         }
      }
   }

   failureListener(fileId, event) {
      let fileInfo = this.fileStore[fileId];
      if (fileInfo) 
      {
         if (fileInfo.state !== uploadState.FAILURE) 
         {
            this.processUploadFailure(fileId, event);
         }
      }
   }

   processUploadCompletion(fileId, event) {
      let fileInfo = this.fileStore[fileId];
      let responseCode = fileInfo.request.status;
      let successful = responseCode >= 200 && responseCode < 300;
      if (successful) 
      {
         var response = JSON.parse(fileInfo.request.responseText);
         fileInfo.id = response.id;
         fileInfo.fileName = response.name;
         fileInfo.state = uploadState.SUCCESS;

         // TODO Update display
         this.onUploadFinished(fileId);
      }
      else 
      {
         this.processUploadFailure(fileId, event);
      }
   }

   processUploadFailure(fileId, event) {
      let fileInfo = this.fileStore[fileId];
      if (fileInfo) 
      {
         fileInfo.state = uploadState.FAILURE;
         // TODO: Update display...
         this.onUploadFinished(fileId);
      }
   }

   onUploadFinished() {
      this._numUploadsInProgress--;

      var changeEvent = new CustomEvent(collectionEvents.ITEM_CREATED, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         orderBy: this.props.orderBy,
         orderDirection: this.props.orderDirection,
         list: this.props.list,
         relations: this.props.relations
      }));

      return (
         <div ref="componentNode" onDrop={this.onDrop.bind(this)}>
            {childrenWithProps}
         </div>
      );
   }
}

export default UploadTarget;