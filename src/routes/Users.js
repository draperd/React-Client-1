import React from "react";
import axios from "axios";

import CreateUserButton from "../components/buttons/CreateUserButton";
import Collection from "../components/containers/Collection";
import { collectionEvents } from "../components/containers/Collection";
import Filter from "../components/controls/Filter";
import UserTableView from "../components/views/UserTableView";
import Content from "../components/layouts/Content";


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




const Users = React.createClass({

   render() {
      return (
         <Content>
            <Collection skipCount={0}
                        maxItems={10}
                        orderBy="firstName"
                        orderDirection="DESC">
               <CreateUserButton/>
               <Filter />
               <UserTableView />
            </Collection>

         </Content>
      );
   }
})

export default Users;