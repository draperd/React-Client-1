/**
 * @module 
 */
import React from "react";
import Create from "../abstract/Create";

/**
 * <p>Extends the abstract [Create]{@link module:components/abstract/Create~Create} component to define
 * a button that when clicked will display a dialog that can be used to create a new item. See
 * the [Create]{@link module:components/abstract/Create~Create} component for full details of the 
 * attributes that can be used with this component.</p>
 * 
 * @class
 */
class CreateButton extends Create {

   /**
    * Overrides [getControl]{@link module:components/abstract/Create~Create#getControl} to return a
    * button.
    * 
    * @return {JSX}
    */
   getControl() {
      return (<button className="mdl-button mdl-js-button mdl-button--raised">{this.label}</button>);
   }
}

export default CreateButton;
