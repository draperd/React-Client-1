/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";
import { collectionEvents } from "../containers/Collection";

/**
 * This is an abstract component that is intented to be extended rather than referenced nested within
 * another component.
 * 
 * @class
 */
class Create extends React.Component {

   /**
    * 
    * @instance
    * @param {object} props
    * @param {string} [url="/api/-default-/public/alfresco/versions/1/people"] The URL to POST to with form data
    * @param {string} [label="Create"] The label for the control that is used to display the dialog
    * @param {string} [dialogTitle="Create"] The title of the dialog used for creation
    * @param {string} [confirmButton="Create"] The title used to confirm the creation action as displayed on the dialog
    * @param {string} [cancelButton="Cancel"] The title used to confirm the creation action as displayed on the dialog
    */
   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.label = props.label || "Create";
      this.dialogTitle = props.dialogTitle || "Create";
      this.confirmButton = props.confirmationButton || "Create";
      this.cancelButton = props.cancelButton || "Cancel";

      this.state = {
         data: {}
      };
   }

   /**
    * 
    * @instance
    */
   openDialog() {
      this.refs.dialog.showModal();
      this.refs.dialog.style.visibility = "visible";
   }

   /**
    * 
    * @instance
    */
   cancel() {
      this.refs.dialog.close();
   }

   /**
    * 
    * @instance
    */
   create() {
      xhr.post(this.url, this.state.data)
         .then(response => {
            if (response.status === 201)
            {
               this.refs.dialog.close();
               var changeEvent = new CustomEvent(collectionEvents.ITEM_CREATED, {
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

   /**
    * 
    * @instance
    */
   handleFormChange(value) {
      this.setState({
         data: value
      });
   }

   getControl() {
      return "";
   }

   /**
    * 
    * @instance
    */
   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         onChange: this.handleFormChange.bind(this),
         data: this.state.data
      }));

      let control = React.cloneElement(this.getControl(), {
         onClick: this.openDialog.bind(this)
      })

      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">{this.dialogTitle}</h3>
            <div className="mdl-dialog__content">
               {childrenWithProps}
            </div>
            <div className="mdl-dialog__actions">
               <button type="button" 
                       className="mdl-button"
                       onClick={this.create.bind(this)}>{this.confirmButton}</button>
               <button type="button" 
                       className="mdl-button"
                       onClick={this.cancel.bind(this)}>{this.cancelButton}</button>
           </div>
         </dialog>
        {control}
      </span>)
   }
}

export default Create;
