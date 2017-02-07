import React from "react";
import xhr from "../../utilities/Xhr";
import { collectionEvents } from "../containers/Collection";

const DeleteUserButtonStyles = {
   dialogContent: {
      whiteSpace: "normal"
   }
};

class Delete extends React.Component {

   constructor(props) {
      super(props);

      this.dialogTitle = props.dialogTitle || "Delete";
      this.dialogPrompt = props.dialogTitle || "Are you sure?";
      this.url = (props.url || "/api/-default-/public/alfresco/versions/1/people") + "/" + this.props.item.entry.id;
   }

   confirm() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

   delete() {
      xhr.delete(this.url)
         .then(response => {
            if (response.status === 204)
            {
               this.refs.dialog.close();
               var changeEvent = new CustomEvent(collectionEvents.ITEM_CREATED, {
                  // detail: response
                  bubbles: true
               });
               this.refs.componentNode.dispatchEvent(changeEvent);
            }
            else
            {
               // TODO: Display an error
            }
         });
   }

   handleFormChange(value) {
      this.setState({
         item: value
      });
   }

   render() {
      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">{this.dialogTitle}</h3>
            <div className="mdl-dialog__content" style={DeleteUserButtonStyles.dialogContent}>
               <p>{this.dialogPrompt}</p>
            </div>
            <div className="mdl-dialog__actions">
               <button type="button" 
                       className="mdl-button"
                       onClick={this.delete.bind(this)}>Yes</button>
               <button type="button" 
                       className="mdl-button"
                       onClick={this.cancel.bind(this)}>No</button>
           </div>
         </dialog>
         <button className="mdl-button mdl-js-button mdl-button--icon"
                 onClick={this.confirm.bind(this)}>
            <i className="material-icons">delete</i>
         </button>
      </span>)
   }
}

export default Delete;