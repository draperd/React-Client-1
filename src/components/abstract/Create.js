/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";
import { collectionEvents } from "../containers/Collection";
import { merge, clone } from "lodash";

/**
 * This is an abstract component that is intented to be extended rather than referenced nested within
 * another component it is extended by by both [CreateButton]{@link module:components/buttons/CreateButton~CreateButton}
 * and [CreateMenuItem]{@link module:components/menuitems/CreateMenuItem~CreateMenuItem}. It provides a simple
 * way of rendering a control that can display a dialog that when confirmed will make a POST request to create
 * a new item.
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
    * @param {string} [includeProps=""] A comma-delimited string of the property values to include in the POST request
    */
   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.label = props.label || "Create";
      this.dialogTitle = props.dialogTitle || "Create";
      this.confirmButton = props.confirmationButton || "Create";
      this.cancelButton = props.cancelButton || "Cancel";
      this.includeProps = props.includeProps || "";

      this.state = {
         data: this.props.formData || {}
      };
   }

   /**
    * Displays the dialog.
    * 
    * @instance
    */
   openDialog() {
      this.refs.dialog.showModal();

      // This is required for controls that can be hidden on use, i.e. menu item in a drop-down menu...
      this.refs.dialog.style.visibility = "visible"; 
   }

   /**
    * Hides the dialog
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

      let clonedData = clone(this.state.data);

      // This works around the issue of the APIs not ignoring data that is superfluous...
      if (this.includeProps)
      {
         let propsToMerge = {};
         this.includeProps.split(",").forEach(function(prop) {
            propsToMerge[prop] = this.props[prop];
         }, this);
         merge(clonedData, propsToMerge);
      }

      xhr.post(this.url, clonedData)
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
    * Called whenever one of the fields in the form is updated and updates the component state with the
    * new value for that field.
    * 
    * @instance
    */
   handleFormChange(value) {
      this.setState({
         data: value
      });
   }

   /**
    * This function needs to be overridden by extending components to ensure that a control is rendered
    * that can be used to display the create dialog.
    * 
    * @return {JSX}
    */
   getControl() {
      return "";
   }

   /**
    * 
    * @instance
    * @return {JSX}
    */
   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         onChange: this.handleFormChange.bind(this),
         data: this.state.data
      }));

      let control = React.cloneElement(this.getControl(), {
         onClick: this.openDialog.bind(this)
      });

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
