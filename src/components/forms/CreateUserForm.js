import React from "react";
import TextField from "../fields/TextField";

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

export default CreateUserForm;