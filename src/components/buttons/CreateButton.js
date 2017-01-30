/**
 * @module 
 */
import React from "react";
import Create from "../abstract/Create";

/**
 * @class
 */
class CreateButton extends Create {

   getControl() {
      return (<button className="mdl-button mdl-js-button mdl-button--raised">{this.label}</button>);
   }
}

export default CreateButton;
