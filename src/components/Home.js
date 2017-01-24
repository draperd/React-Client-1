import React from "react";
import axios from "axios";

import Collection from "./containers/Collection";
import { collectionEvents } from "./containers/Collection";

import Pagination from "./controls/Pagination";

import TableCell from "./renderers/TableCell";
import TableHeading from "./renderers/TableHeading";

import TableView from "./views/TableView";
import UserTableView from "./views/UserTableView";

class Filter extends React.Component {

   onChange(event) {
      var changeEvent = new CustomEvent(collectionEvents.FILTER, {
         detail: {
            term: event.target.value
         },
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      return (
         <div ref="componentNode"
              className="mdl-textfield mdl-js-textfield">
            <input className="mdl-textfield__input" 
                   type="text" 
                   id="filter" 
                   onChange={this.onChange.bind(this)}/>
            <label className="mdl-textfield__label" htmlFor="filter">Search...</label>
         </div>
      );
   }
}

class TextField extends React.Component {

   render() {
      return (
         <div className="mdl-textfield mdl-js-textfield">
            <input id={this.props.id}
                   name={this.props.name}
                   className="mdl-textfield__input" 
                   type={this.props.type || "text"} 
                   value={this.props.value}
                   onChange={this.props.onChange} />
           <label className="mdl-textfield__label" 
                   htmlFor={this.props.id}>{this.props.label}</label>
         </div>
      )
   }
}

class CreateUserForm extends React.Component {
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      this.props.user[event.target.name] = event.target.value;
      this.props.onChange(this.props.user);
   }

   render() {
      return (
         <form autoComplete="nope" onSubmit={this.handleSubmit}>
            <TextField id="new_user_id"
                       name="id"
                       value={this.props.user.id}
                       onChange={this.handleChange} 
                       label="User Name"/>

            <TextField id="new_user_firstName"
                       name="firstName"
                       value={this.props.user.firstName}
                       onChange={this.handleChange} 
                       label="First Name"/>

            <TextField id="new_user_lastName"
                       name="lastName"
                       value={this.props.user.lastName}
                       onChange={this.handleChange} 
                       label="Last Name"/>

            <TextField id="new_user_email"
                       name="email"
                       value={this.props.user.email}
                       onChange={this.handleChange} 
                       label="E-mail Address"/>

            <TextField id="new_user_password"
                       name="password"
                       value={this.props.user.password}
                       onChange={this.handleChange}
                       type="password"
                       label="Password"/>
         </form>
      );
   }
}


class CreateUserButton extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         user: {
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            password: ""
         }
      };
   }

   openDialog() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

   create() {
      axios.post("/api/-default-/public/alfresco/versions/1/people", this.state.user)
         .then(response => {
            if (response.status === 201)
            {
               this.refs.dialog.close();
               var changeEvent = new CustomEvent(collectionEvents.ITEM_CREATED, {
                  // detail: response
                  bubbles: true
               });
               this.refs.componentNode.dispatchEvent(changeEvent);
            }
            else
            {
               // TODO: Display an error
            }
         })
   }

   handleFormChange(value) {
      this.setState({
         user: value
      });
   }

   render() {
      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">Add New User</h3>
            <div className="mdl-dialog__content">
               <CreateUserForm onChange={this.handleFormChange.bind(this)} 
                               user={this.state.user} />
            </div>
            <div className="mdl-dialog__actions">
               <button type="button" 
                       className="mdl-button"
                       onClick={this.create.bind(this)}>Create</button>
               <button type="button" 
                       className="mdl-button"
                       onClick={this.cancel.bind(this)}>Cancel</button>
           </div>
         </dialog>
         <button className="mdl-button mdl-js-button mdl-button--raised"
                 onClick={this.openDialog.bind(this)}>Create</button>
      </span>)
   }
}

const Home = React.createClass({

   render() {
      return (
         <div>
            <Collection skipCount={0}
                        maxItems={10}
                        orderBy="firstName"
                        orderDirection="DESC">
               <CreateUserButton/>
               <Filter />
               <UserTableView />
            </Collection>

            <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" >
               <TableView 
                  headerChildren={
                     [<TableHeading label="Name" />,
                      <TableHeading label="Created By" />]
                  }
                  bodyChildren={
                     [<TableCell property="name" />,
                      <TableCell property="createdByUser.displayName" />]
                  }
                  footerChildren={
                     <Pagination colspan="2"/>
                  }
               >
               </TableView>
            </Collection>
         </div>
      )
   }
})

export default Home;