import React from "react";
import axios from "axios";
import { collectionEvents } from "../containers/Collection";

class Toggle extends React.Component {

   constructor(props) {
      super(props);
      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.toggleId = this.props.user.entry.id + "_enabledToggle";
   }

   onToggle() {
      axios.put(`${this.url}/${this.props.user.entry.id}`, {
         enabled: this.refs.toggle.checked
      })
         .then(response => {
            if (response.status === 200)
            {
               var changeEvent = new CustomEvent(collectionEvents.ITEM_UPDATED, {
                  bubbles: true
               });
               this.refs.toggle.dispatchEvent(changeEvent);
            }
         });
   }

   componentDidUpdate() {
      // NOTE: This was required to ensure rendering was correct, ideally this should not be necessary
      if (this.props.user.entry.enabled)
      {
         this.refs.componentNode.classList.add("is-checked");
      }
      else
      {
         this.refs.componentNode.classList.remove("is-checked");
      }
   }

   componentDidMount() {
      window.componentHandler.upgradeElement(this.refs.componentNode);
   }

   render() {
      return (
         <label ref="componentNode" 
                className="mdl-switch mdl-js-switch mdl-js-ripple-effect" 
                htmlFor={this.toggleId}>
            <input type="checkbox" 
                   ref="toggle"
                   id={this.toggleId} 
                   className="mdl-switch__input" 
                   checked={this.props.user.entry.enabled} 
                   onChange={this.onToggle.bind(this)} />
            <span className="mdl-switch__label"></span>
         </label>
      );
   }
}

export default Toggle;