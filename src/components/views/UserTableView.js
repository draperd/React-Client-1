import React from "react";

import Pagination from "../controls/Pagination";

import Delete from "../renderers/Delete";
import TableHeading from "../renderers/TableHeading";
import Toggle from "../renderers/Toggle";

class UserTableView extends React.Component {

   render() {
      return ( 
         <table ref="componentNode" className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            <thead>
               <tr>
                  <TableHeading label="Name" 
                                orderById="firstName"
                                orderBy={this.props.orderBy}
                                orderDirection={this.props.orderDirection} />
                  <TableHeading label="User Name" 
                                orderById="id"
                                orderBy={this.props.orderBy}
                                orderDirection={this.props.orderDirection} />
                  <TableHeading label="E-Mail Address" 
                                orderById="email"
                                orderBy={this.props.orderBy}
                                orderDirection={this.props.orderDirection} />
                  <th className="mdl-data-table__cell--non-numeric">Enabled</th>
                  <th className="mdl-data-table__cell--non-numeric">Actions</th>
               </tr>
            </thead>
            <tbody>{this.props.list.entries.map((entry) => 
               <tr key={entry.entry.id}>
                  <td className="mdl-data-table__cell--non-numeric">{entry.entry.firstName} {entry.entry.lastName}</td>
                  <td className="mdl-data-table__cell--non-numeric">{entry.entry.id}</td>
                  <td className="mdl-data-table__cell--non-numeric">{entry.entry.email}</td>
                  <td className="mdl-data-table__cell--non-numeric">
                     <Toggle item={entry}
                             url="/api/-default-/public/alfresco/versions/1/people" />
                  </td>
                  <td className="mdl-data-table__cell--non-numeric">
                     <Delete item={entry}
                             url="/api/-default-/public/alfresco/versions/1/people" />
                  </td>
               </tr>
            )}</tbody>
            <tfoot>
               <tr>
                  <td colSpan="5">
                     <Pagination list={this.props.list}/>
                  </td>
               </tr>
            </tfoot>
         </table>);
   }
}

export default UserTableView;