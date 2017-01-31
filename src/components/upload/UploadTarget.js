/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";
import { collectionEvents } from "../containers/Collection";
import { merge, clone } from "lodash";

/**
 * 
 * @static
 * @type {object}
 * @property {string} ADDED The file has been added and is pending upload
 * @property {string} FAILURE The file could not be uploaded
 * @property {string} SUCCESS The file was successfully uploaded
 * @property {string} UPLOADING The file is currently uploading
 */
const uploadState = {
   ADDED: "added",
   FAILURE: "failure",
   SUCCESS: "success",
   UPLOADING: "uploading"
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

      // NOTE: It is necessary to bind in the constructor rather than on registration in order
      //       that the event listeners can be removed
      //       See: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
      this.onDrop = this.onDrop.bind(this);
      this.onDrageEnter = this.onDragEnter.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
   }

   /**
    * 
    * @instance
    */
   componentDidMount() {
      this.addUploadSuport();
   }

   /**
    * Adds event listeners for the drop, dragenter and dragover events when drag-and-drop
    * is supported by the browser.
    * 
    * @instance
    */
   addUploadSuport() {
      if ("draggable" in document.createElement("span"))
      {
         this.dndUploadEnabled = true;
         this.refs.componentNode.addEventListener("drop", this.onDrop);
         this.refs.componentNode.addEventListener("dragenter", this.onDragEnter);
         this.refs.componentNode.addEventListener("dragover", this.onDragOver);
      }
   }

   /**
    * Removes event listeners for the drop, dragenter and dragover events
    * 
    * @instance
    */
   removeUploadSupport() {
      this.refs.componentNode.removeEventListener("drop", this.onDrop);
      this.refs.componentNode.removeEventListener("dragenter", this.onDragEnter);
      this.refs.componentNode.removeEventListener("dragover", this.onDragOver);
   }

   /**
    * 
    * @instance
    * @param {object} event The drag over event
    */
   onDragEnter(event) {
      
   }

   /**
    * Prevents further propagation of the drag over event to ensure that drop events
    * can be properly handled.
    * 
    * @instance
    * @param {object} event The drag over event
    */
   onDragOver(event) {
      event.stopPropagation();
      event.preventDefault();
   }

   /**
    * 
    * @instance
    * @param {object} event The drop event
    */
   onDrop(event) {
      // Only perform a file upload if the user has *actually* dropped some files!
      if (event.dataTransfer.files !== undefined && 
          event.dataTransfer.files !== null && 
          event.dataTransfer.files.length > 0)
      {
         let uploadConfig = {
            description: "",
            overwrite: false,
            thumbnails: "doclib",
            username: null,
            relativePath: this.props.relativePath || "/"
         };
         this.onUploadRequest({
            files: event.dataTransfer.files,
            targetData: uploadConfig
         });
      }
      else
      {
         // Error handling?
      }

      event.stopPropagation();
      event.preventDefault();
   }

   /**
    * 
    * @instance
    * @param {object}   input
    * @param {FileList} input.files The files to upload
    * @param {object}   input.targetData The basic upload configuration
    */
   onUploadRequest(input) {
      if (input.files && input.targetData) 
      {
         this.totalNewUploads += input.files.length;
         this.startUploads(input);
      }
   }

   /**
    * 
    * @instance
    * @param  {object} input
    * @param  {File}   input.file The file to construct the upload configuration for
    * @param  {string} input.fileName The name of the file to be uploaded
    * @param  {object} input.targetData The base configuration for uploading
    * @return {object} The upload configuration specific to the supplied file data.
    */
   createUploadConfig(input) {
      return {
         filedata: input.file,
         filename: input.fileName,
         relativePath: this.props.relativePath || "/",
         majorVersion: input.targetData.majorVersion ? input.targetData.majorVersion : "true",
         description: input.targetData.description,
         overwrite: input.targetData.overwrite,
         thumbnails: input.targetData.thumbnails,
         username: input.targetData.username
      };
   }

   /**
    * 
    * 
    * @param  {[type]} input [description]
    * @return {[type]}       [description]
    */
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
      let uploadData = this.createUploadConfig({
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

   /**
    * 
    * @instance
    * @param {object}   input
    * @param {FileList} input.files The files to upload
    * @param {object}   input.targetData The basic upload configuration
    */
   startUploads(input) {
      // Set up the request and configuration for each file...
      Object.keys(input.files).forEach(function(key) {
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
      
      // Start uploading...
      Object.keys(this.fileStore).forEach(function(fileId) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo.state === uploadState.ADDED) {
            this.startFileUpload(fileInfo);
         }
      }, this);
   }

   /**
    * Starts uploading the supplied file.
    * 
    * @instance
    * @param  {object} fileInfo The details of the file to upload
    */
   startFileUpload(fileInfo) {
      // TODO: Ensure we only upload the maximum allowed at a time
      this._numUploadsInProgress++;

      fileInfo.state = uploadState.UPLOADING;

      let uploadData = fileInfo.uploadData;
      let formData = new FormData();
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

   /**
    * 
    * @instance
    * @param  {string} fileId The unique id of the file upload
    * @param  {object} event  The upload progress event for the file
    */
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

   /**
    * Calculates the overall progress of the uploads that are currently ongoing
    * 
    * @instance
    */
   updateAggregateProgress() {
      let fileIds = Object.keys(this.fileStore);
      let totalPercent = this.totalNewUploads * 100;
      let cumulativeProgress = 0;
      let inProgressFiles = 0;

      // Run through all uploads, calculating total and current progress
      fileIds.forEach(function(fileId) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo.state === uploadState.ADDED || fileInfo.state === uploadState.UPLOADING) 
         {
            cumulativeProgress += fileInfo.progress;
            inProgressFiles++;
         }
      }, this);

      // Add completed files to the cumulative total
      cumulativeProgress += (this.totalNewUploads - inProgressFiles) * 100;

      // Calculate total percentage and send to widget
      // NOTE: If no in-progress files, or race-condition causes zero total percent, then
      // just call it 100, because it will mean that essentially there are no pending uploads
      var currentProgressPercent = (inProgressFiles && totalPercent) ? Math.floor(cumulativeProgress / totalPercent * 100) : 100;
      this.uploadDisplayWidget.updateAggregateProgress(currentProgressPercent / 100);

      // If no longer have uploads pending, update the total-completed variable
      if (currentProgressPercent === 100) 
      {
         this.resetTotalUploads();
      }

      // TODO: Display status...
   }

   /**
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has been uploaded
    * @param {object} event The event captured as a result of the upload success.
    */
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

   /**
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has failed to upload
    * @param {object} event The event captured as a result of the upload failure.
    */
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

   /**
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has finished uploading
    * @param {object} event The event captured as a result of the upload completion.
    */
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

   /**
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has finished (or failed) uploading
    * @param {object} event The event captured as a result of the upload failure.
    */
   processUploadFailure(fileId, event) {
      let fileInfo = this.fileStore[fileId];
      if (fileInfo) 
      {
         fileInfo.state = uploadState.FAILURE;
         // TODO: Update display...
         this.onUploadFinished(fileId);
      }
   }

   /**
    * Handles the completion of an upload (successful or otherwise) and emits an
    * event to indicate that a new item has been created.
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has finished (or failed) uploading
    */
   onUploadFinished(fileId) {
      this._numUploadsInProgress--;

      var changeEvent = new CustomEvent(collectionEvents.ITEM_CREATED, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   /**
    * 
    * @instance
    * @return {JSX}
    */
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