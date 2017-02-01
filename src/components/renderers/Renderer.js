/**
 * @module
 */
import React from "react";
import { get } from "lodash";
import { collectionEvents } from "../containers/Collection";

/**
 * This is an abstract class that is intended to be extended to provide reusable
 * functions for rendering data.
 * 
 * @class
 */
class Renderer extends React.Component {

   /**
    * 
    * 
    * @instance
    */
   navigate() {
      let changeEvent = new CustomEvent(collectionEvents.NAVIGATE, {
         detail: this.props.item,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   /**
    * @instance
    */
   view() {
      this.context.router.push(`/node/${this.props.item.entry.id}`);
   }

   /**
    * 
    * @instance
    * @param  {object} input
    * @param  {object} input.item The item to retrieve the property value from
    * @param  {string} input.property The property to retrieve from the item (can be in dot-notation form)
    * @return {string} A string value representation of the requested property
    */
   getPropertyStringValue(input) {
      let value;
      if (input && 
          input.item &&
          input.property)
      {
         let renderedProperty = get(input.item, input.property, "");
         if (typeof renderedProperty.toString === "function")
         {
            value = renderedProperty.toString();
         }
      }
      return value || "";
   }

   /**
    * 
    * @instance
    * @param  {object} input
    * @param  {string} input.value The string value to render as a date
    * @return {string} A formatted date
    */
   renderAsDATE(input) {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return new Date(input.value).toLocaleDateString("en-GB", options);
   }

   /**
    * 
    * @instance
    * @param  {object} input
    * @param  {string} input.value The string value of the property
    * @param  {string} input.renderAs An identifer for how the value should be rendered
    * @return {string} The processed property value
    */
   processPropertyValue(input) {
      let processedValue = input.value || "";
      if (input &&
          input.value &&
          input.renderAs)
      {
         let functionName = "renderAs" + input.renderAs;
         if (typeof this[functionName] === "function")
         {
            processedValue = this[functionName](input);
         }
      }

      return processedValue;
   }

   /**
    * 
    * @instance
    * @return {JSX}
    */
   render() {
      return (<span></span>);
   }
}

Renderer.contextTypes = {
    router: React.PropTypes.object
};

export default Renderer;