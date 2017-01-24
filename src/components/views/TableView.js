import React from "react";

import Pagination from "../controls/Pagination";

import Delete from "../renderers/Delete";
import TableHeading from "../renderers/TableHeading";
import Toggle from "../renderers/Toggle";

class UserTableView extends React.Component {

   render() {
      const headerChildrenWithProps = React.Children.map(this.props.headerChildren, (child) => React.cloneElement(child, {
         orderBy: this.props.orderBy,
         orderDirection: this.props.orderDirection
      }));
      
      const footerChildrenWithProps = React.Children.map(this.props.footerChildren, (child) => React.cloneElement(child, {
         list: this.props.list
      }));

      let body = this.props.list.entries.map((entry) => {
         const bodyChildrenWithProps = React.Children.map(this.props.bodyChildren, (child) => React.cloneElement(child, {
            item: entry
         }));
         return (
            <tr key={entry.entry.id}>
               {bodyChildrenWithProps}
            </tr>
         );
      });

      return ( 
         <table ref="componentNode" className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            <thead>
               <tr>
                  {headerChildrenWithProps}
               </tr>
            </thead>
            <tbody>{body}</tbody>
            <tfoot>
               <tr>
                  {footerChildrenWithProps}
               </tr>
            </tfoot>
         </table>);
   }
}

export default UserTableView;