import React from "react";
import xhr from "../../utilities/Xhr";
import { collectionEvents } from "../containers/Collection";

class Create extends React.Component {

   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.formTitle = props.formTitle || "Create";

      this.state = {
         data: {}
      };
   }

   openDialog() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

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

   handleFormChange(value) {
      this.setState({
         data: value
      });
   }

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         onChange: this.handleFormChange.bind(this),
         data: this.state.data
      }));

      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">{this.formTitle}</h3>
            <div className="mdl-dialog__content">
               {childrenWithProps}
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

export default Create;
