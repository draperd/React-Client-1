/**
 * @module
 */
import React from "react";
import Create from "../abstract/Create";

/**
 * @class
 */
class CreateMenuItem extends Create {

   getControl() {
      return (<li className="mdl-menu__item">{this.label}</li>);
   }
}

export default CreateMenuItem;
