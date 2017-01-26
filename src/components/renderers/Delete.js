import React from "react";
import axios from "axios";
import { collectionEvents } from "../containers/Collection";
import auth from "../../utilities/Authentication";

const DeleteUserButtonStyles = {
   dialogContent: {
      whiteSpace: "normal"
   }
};

class Delete extends React.Component {

   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
   }

   confirm() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

   delete() {
      axios.delete(`${this.url}/{this.props.item.entry.id}`, auth.getAxiosConfig())
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
         item: value
      });
   }

   render() {
      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">Delete {this.props.item.entry.firstName} {this.props.item.entry.lastName}</h3>
            <div className="mdl-dialog__content" style={DeleteUserButtonStyles.dialogContent}>
               <p>Are you sure you want to delete {this.props.item.entry.firstName} {this.props.item.entry.lastName}</p>
               <p>Deleting a item does not remove their permissions from the repository. These permissions will be reused if the item is recreated later. You can also disable the item account.</p>
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