import React from "react";
import { get } from "lodash";
import { collectionEvents } from "../containers/Collection";

class TableCell extends React.Component {

   constructor(props) {
      super(props);
      this.property = props.property || "id";
   }

   navigate() {
      let changeEvent = new CustomEvent(collectionEvents.NAVIGATE, {
         detail: this.props.item,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      let renderedProperty = get(this.props.item.entry, this.property, "");
      if (this.props.navigation)
      {
         renderedProperty = (<span role="link" onClick={this.navigate.bind(this)}>{renderedProperty}</span>);
      }

      return (
         <td ref="componentNode" className="mdl-data-table__cell--non-numeric">{renderedProperty}</td>
      );
   }
}

export default TableCell;