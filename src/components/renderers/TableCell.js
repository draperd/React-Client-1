import React from "react";
import { get } from "lodash";
import { collectionEvents } from "../containers/Collection";

class TableCell extends React.Component {

   constructor(props) {
      super(props);
      this.property = props.property;
   }

   navigate() {
      let changeEvent = new CustomEvent(collectionEvents.NAVIGATE, {
         detail: this.props.item,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      if (this.props.property)
      {
         let renderedProperty = get(this.props.item.entry, this.property, "");
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

         return (
            <td ref="componentNode" className="mdl-data-table__cell--non-numeric">{renderedProperty}</td>
         );
      }
      else
      {
         const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            item: this.props.item
         }));
         return (
            <td ref="componentNode" className="mdl-data-table__cell--non-numeric">{childrenWithProps}</td>
         );
      }
       

      
   }
}

export default TableCell;