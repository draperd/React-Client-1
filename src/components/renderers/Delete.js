import React from "react";
import axios from "axios";
import { collectionEvents } from "../containers/Collection";

const DeleteUserButtonStyles = {
   dialogContent: {
      whiteSpace: "normal"
   }
};


class Delete extends React.Component {

   confirm() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

   delete() {
      axios.delete(`/api/-default-/public/alfresco/versions/1/people/{this.props.user.entry.id}`)
         .then(response => {
            if (response.status === 200)
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
         user: value
      });
   }

   render() {
      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">Delete {this.props.user.entry.firstName} {this.props.user.entry.lastName}</h3>
            <div className="mdl-dialog__content" style={DeleteUserButtonStyles.dialogContent}>
               <p>Are you sure you want to delete {this.props.user.entry.firstName} {this.props.user.entry.lastName}</p>
               <p>Deleting a user does not remove their permissions from the repository. These permissions will be reused if the user is recreated later. You can also disable the user account.</p>
            </div>
            <div className="mdl-dialog__actions">
               <button type="button" 
                       className="mdl-button"
                       onClick={this.delete.bind(this)}>Delete</button>
               <button type="button" 
                       className="mdl-button"
                       onClick={this.cancel.bind(this)}>Cancel</button>
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