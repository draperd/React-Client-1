/**
 * @module
 */
import React from "react";
import Create from "../abstract/Create";

/**
 * <p>Extends the abstract [Create]{@link module:components/abstract/Create~Create} component to define
 * a menu item that when clicked will display a dialog that can be used to create a new item. See
 * the [Create]{@link module:components/abstract/Create~Create} component for full details of the 
 * attributes that can be used with this component.</p>
 *
 * <p>It is expected that this component will be nested within a [Menu]{@link module:components/buttons/Menu~Menu}
 * component. It is expected that it will nest a form component.</p>
 * 
 * @class
 */
class CreateMenuItem extends Create {

   /**
    * Overrides [getControl]{@link module:components/abstract/Create~Create#getControl} to return a
    * list item.
    * 
    * @return {JSX}
    */
   getControl() {
      return (<li className="mdl-menu__item">{this.label}</li>);
   }
}

export default CreateMenuItem;
