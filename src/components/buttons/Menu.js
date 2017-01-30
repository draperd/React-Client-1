/**
 * @module
 */
import React from "react";
import { uniqueId } from "lodash";

/**
 * @class
 */
class Menu extends React.Component {

   /**
    * 
    * @constructor
    * @param {object} props
    * @param {string} [label="Open Menu"] The label to show on the button
    * @param {string} [id="components_buttons_Menu__{n}"] The identifier for the button, if not provided one will be generated
    */
   constructor(props) {
      super(props);
      this.label = props.label || "Open Menu";
      this.id = props.id || uniqueId("components_buttons_Menu__");
   }

   /**
    * 
    * @instance
    */
   render() {
      return (
         <span ref="componentNode">
            <button id={this.id}
                    className="mdl-button mdl-js-button mdl-button--raised">{this.label}</button>
            <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                htmlFor={this.id}>
               {this.props.children}
            </ul>
         </span>
      );
   }
}

export default Menu;
