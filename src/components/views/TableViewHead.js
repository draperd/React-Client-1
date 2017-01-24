import React from "react";

class TableViewHead extends React.Component {

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         orderBy: this.props.orderBy,
         orderDirection: this.props.orderDirection
      }));

      return ( 
         <thead>
            <tr>
               {childrenWithProps}
            </tr>
         </thead>);
   }
}

export default TableViewHead;