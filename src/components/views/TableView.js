import React from "react";

class TableView extends React.Component {

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         orderBy: this.props.orderBy,
         orderDirection: this.props.orderDirection,
         list: this.props.list,
         relations: this.props.relations
      }));

      if (this.props.list.entries.length)
      {
         return ( 
            <table ref="componentNode" className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
               {childrenWithProps}
            </table>);
      }
      else
      {
         return (
            <div style={{paddingLeft: "15px"}}>No items</div>
         );
      }
   }
}

export default TableView;