import React from "react";
import { collectionEvents } from "../containers/Collection";

class TableHeading extends React.Component {

   orderBy() {
      var changeEvent = new CustomEvent(collectionEvents.REORDER, {
         detail: {
            orderBy: this.props.orderById
         },
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      let sortIndicator = "";
      if (this.props.orderById === this.props.orderBy)
      {
         let icon = this.props.orderDirection === "ASC" ? "arrow_upward" : "arrow_downward";
         sortIndicator = <button className="mdl-button mdl-js-button mdl-button--icon">
            <i className="material-icons">{icon}</i>
         </button>
      }
      return (
         <th ref="componentNode" className="mdl-data-table__cell--non-numeric" 
             onClick={this.orderBy.bind(this)}>{sortIndicator}{this.props.label}</th>
      );
   }
}

export default TableHeading;