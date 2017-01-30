import React from "react";
import { get } from "lodash";
import { collectionEvents } from "../containers/Collection";

class TableCell extends React.Component {

   constructor(props) {
      super(props);
      this.property = props.property;
      this.colspan = props.colspan || 1;
   }

   navigate() {
      let changeEvent = new CustomEvent(collectionEvents.NAVIGATE, {
         detail: this.props.item,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   view() {
      this.context.router.push(`/node/${this.props.item.entry.id}`);
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

         return (
            <td ref="componentNode" 
                colSpan={this.colspan} 
                className="mdl-data-table__cell--non-numeric"
                onClick={ this.props.navigation ? this.navigate.bind(this) : "" }
                onDoubleClick={ this.props.view ? this.view.bind(this) : "" }
                >{renderedProperty}</td>
         );
      }
      else
      {
         const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            item: this.props.item,
            list: this.props.list
         }));
         return (
            <td ref="componentNode" 
                colSpan={this.colspan} 
                className="mdl-data-table__cell--non-numeric">{childrenWithProps}</td>
         );
      }
   }
}

TableCell.contextTypes = {
    router: React.PropTypes.object
};

export default TableCell;