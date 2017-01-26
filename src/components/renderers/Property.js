import React from "react";
import { get } from "lodash";

class Property extends React.Component {

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

      return (<span>{renderedProperty}</span>);
   }
}

export default Property;