/**
 * @module
 */
import React from "react";
import { collectionEvents } from "../containers/Collection";

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

      this.state = {
         files: {},
         uploadsInProgress: 0,
         totalNewUploads: 0,
         currentProgress: 0
      };
      
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
    * @param {object} input
    * @param {File}   input.file The file to create the state item for
    * @param {object} input.targetData The upload config 
    * @return {object} The upload request configuration
    */
   createUploadStateItem(input) {
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

      return {
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
      const files = this.state.files;

      // Set up the request and configuration for each file...
      Object.keys(input.files).forEach(function(key) {
         let fileId = Date.now();
         while (this.state.files.hasOwnProperty(fileId)) 
         {
            fileId = Date.now();
         }

         files[fileId] = this.createUploadStateItem({
            fileId: fileId,
            file: input.files.item(key),
            targetData: input.targetData
         });

      }, this);
      

      this.setState({
         files: files,
         totalNewUploads: this.state.totalNewUploads + input.files.length
      }, () => {

         // Start uploading...
         Object.keys(this.state.files).forEach(function(fileId) {
            var fileInfo = this.state.files[fileId];
            if (fileInfo.state === uploadState.ADDED) 
            {
               this.startFileUpload(fileId, fileInfo);
            }
         }, this);

         this.openDialog();
      });

      
   }

   /**
    * Starts uploading the supplied file.
    * 
    * @instance
    * @param  {object} fileInfo The details of the file to upload
    */
   startFileUpload(fileId, fileInfo) {
      // TODO: Ensure we only upload the maximum allowed at a time
      
      const files = this.state.files;
      files[fileId].state = uploadState.UPLOADING;

      this.setState({
         files: files
      }, () => {

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
      });
   }

   /**
    * 
    * @instance
    * @param  {string} fileId The unique id of the file upload
    * @param  {object} event  The upload progress event for the file
    */
   uploadProgressListener(fileId, event) {
      const files = this.state.files;
      let fileInfo = files[fileId];
      if (fileInfo && event.lengthComputable) 
      {
         var progress = Math.min(Math.round(event.loaded / event.total * 100), 100);
         fileInfo.progress = progress;
         this.setState({
            files: files
         }, () => {
            this.updateAggregateProgress();
         });
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
      const files = this.state.files;
      let fileIds = Object.keys(files);
      let totalPercent = this.state.totalNewUploads * 100;
      let cumulativeProgress = 0;
      let inProgressFiles = 0;

      // Run through all uploads, calculating total and current progress
      fileIds.forEach(function(fileId) {
         var fileInfo = files[fileId];
         if (fileInfo.state === uploadState.ADDED || fileInfo.state === uploadState.UPLOADING) 
         {
            cumulativeProgress += fileInfo.progress;
            inProgressFiles++;
         }
      }, this);

      // Add completed files to the cumulative total
      cumulativeProgress += (this.state.totalNewUploads - inProgressFiles) * 100;

      // Calculate total percentage and send to widget
      // NOTE: If no in-progress files, or race-condition causes zero total percent, then
      // just call it 100, because it will mean that essentially there are no pending uploads
      var currentProgressPercent = (inProgressFiles && totalPercent) ? Math.floor(cumulativeProgress / totalPercent * 100) : 100;
      
      this.setState({
         files: files,
         uploadsInProgress: inProgressFiles,
         currentProgress: currentProgressPercent,
         totalNewUploads: currentProgressPercent === 100 ? 0 : this.state.totalNewUploads
      }, () => {
         if (this.state.totalNewUploads === 0)
         {
            this.closeDialog();
         }
      });
   }

   /**
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has been uploaded
    * @param {object} event The event captured as a result of the upload success.
    */
   successListener(fileId, event) {
      let fileInfo = this.state.files[fileId];
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
      let fileInfo = this.state.files[fileId];
      if (fileInfo && fileInfo.state !== uploadState.FAILURE) 
      {
         this.processUploadFailure(fileId, event);
      }
   }

   /**
    * 
    * @instance
    * @param {string} fileId The unique id of the file that has finished uploading
    * @param {object} event The event captured as a result of the upload completion.
    */
   processUploadCompletion(fileId, event) {
      const files = this.state.files;
      let fileInfo = files[fileId];
      let responseCode = fileInfo.request.status;
      let successful = responseCode >= 200 && responseCode < 300;
      if (successful) 
      {
         var response = JSON.parse(fileInfo.request.responseText);
         fileInfo.id = response.id;
         fileInfo.fileName = response.name;
         fileInfo.state = uploadState.SUCCESS;

         this.setState({
            files: files,
            uploadsInProgress: this.state.uploadsInProgress - 1
         }, () => this.onUploadFinished(fileId));
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
      const files = this.state.files;
      let fileInfo = files[fileId];
      if (fileInfo) 
      {
         fileInfo.state = uploadState.FAILURE;
         this.setState({
            files: files,
            uploadsInProgress: this.state.uploadsInProgress - 1
         }, () => this.onUploadFinished(fileId));
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
      var changeEvent = new CustomEvent(collectionEvents.ITEM_CREATED, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   openDialog() {
      this.refs.dialog.showModal();
   }

   closeDialog() {
      this.refs.dialog.close();
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
            <dialog ref="dialog" className="mdl-dialog">
               <h3 className="mdl-dialog__title">Uploading...</h3>
               <div className="mdl-dialog__content">
                  Upload Progress: {this.state.currentProgress}%
               </div>
            </dialog>
            {childrenWithProps}
         </div>
      );
   }
}

export default UploadTarget;