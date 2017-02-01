/**
 * @module
 */
import React from "react";
import Renderer from "./Renderer";

/**
 * <p>Renders a property of the current item. The rendering capabilities are inherited from the 
 * [Renderer]{@link module:components/renderers/Renderer~Renderer}
 * class that this extends.</p>
 *
 * @example <caption>Renders the "name" property of the current item</caption>
 * <Property property="name" />
 * 
 * @class
 */
class Property extends Renderer {

   /**
    * @instance
    * @return {JSX}
    */
   render() {
      
      let renderedProperty = this.getPropertyStringValue({
         item: this.props.item.entry,
         property: this.props.property
      });

      renderedProperty = this.processPropertyValue({
         value: renderedProperty,
         renderAs: this.props.renderAs
      });

      return (<span ref="componentNode"
                    onClick={ this.props.navigation ? this.navigate.bind(this) : "" }
                    onDoubleClick={ this.props.view ? this.view.bind(this) : "" }>{renderedProperty}</span>);
   }
}

export default Property;