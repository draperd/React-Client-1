import React from "react";
import axios from "axios";
import { collectionEvents } from "../containers/Collection";
import CreateUserForm from "../forms/CreateUserForm";
import auth from "../../utilities/Authentication";

class CreateUserButton extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         user: {
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            password: ""
         }
      };
   }

   openDialog() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

   create() {
      axios.post("/api/-default-/public/alfresco/versions/1/people", this.state.user, auth.getAxiosConfig())
         .then(response => {
            if (response.status === 201)
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
            <h3 className="mdl-dialog__title">Add New User</h3>
            <div className="mdl-dialog__content">
               <CreateUserForm onChange={this.handleFormChange.bind(this)} 
                               user={this.state.user} />
            </div>
            <div className="mdl-dialog__actions">
               <button type="button" 
                       className="mdl-button"
                       onClick={this.create.bind(this)}>Create</button>
               <button type="button" 
                       className="mdl-button"
                       onClick={this.cancel.bind(this)}>Cancel</button>
           </div>
         </dialog>
         <button className="mdl-button mdl-js-button mdl-button--raised"
                 onClick={this.openDialog.bind(this)}>Create</button>
      </span>)
   }
}

export default CreateUserButton;
