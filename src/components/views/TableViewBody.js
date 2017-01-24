import React from "react";

class TableViewBody extends React.Component {

   render() {
      let body = this.props.list.entries.map((entry) => {
         const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            item: entry
         }));
         return (
            <tr key={entry.entry.id}>
               {childrenWithProps}
            </tr>
         );
      });

      return ( 
         <tbody>{body}</tbody>
      );
   }
}

export default TableViewBody;