import React from "react";

class TableView extends React.Component {

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         orderBy: this.props.orderBy,
         orderDirection: this.props.orderDirection,
         list: this.props.list
      }));

      return ( 
         <table ref="componentNode" className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            {childrenWithProps}
         </table>);
   }
}

export default TableView;