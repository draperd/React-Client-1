import React from "react";
import { get } from "lodash";
import { collectionEvents } from "../containers/Collection";

class Property extends React.Component {

   navigate() {
      let changeEvent = new CustomEvent(collectionEvents.NAVIGATE, {
         detail: this.props.item,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      
      let renderedProperty = get(this.props.item.entry, this.props.property || "id", "");
      if (typeof renderedProperty.toString === "function")
      {
         renderedProperty = renderedProperty.toString();
      }

      if (this.props.renderAs === "DATE")
      {
         var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
         renderedProperty = new Date(renderedProperty).toLocaleDateString("en-GB", options);
      }

      if (this.props.navigation)
      {
         renderedProperty = (<span role="link" onClick={this.navigate.bind(this)}>{renderedProperty}</span>);
      }

      return (<span ref="componentNode">{renderedProperty}</span>);
   }
}

export default Property;