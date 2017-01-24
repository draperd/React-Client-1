import React from "react";

class TableCell extends React.Component {

   constructor(props) {
      super(props);
      this.property = props.property || "id";
   }
   render() {
      var renderedProperty = this.props.item.entry[this.property];
      return (
         <td className="mdl-data-table__cell--non-numeric">{renderedProperty}</td>
      );
   }
}

export default TableCell;