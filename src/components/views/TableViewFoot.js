import React from "react";

class TableViewFoot extends React.Component {

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         list: this.props.list
      }));

      return ( 
         <tfoot>
            <tr>
               {childrenWithProps}
            </tr>
         </tfoot>);
   }
}

export default TableViewFoot;