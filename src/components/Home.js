import React from "react";
import axios from "axios";

const customEvents = {
   ITEM_CREATED: "itemCreated",
   PAGE_FORWARDS: "pageForward",
   PAGE_BACKWARDS: "pageBackward"
};


const DeleteUserButtonStyles = {
   dialogContent: {
      whiteSpace: "normal"
   }
};


class DeleteUserButton extends React.Component {

   confirm() {
      this.refs.dialog.showModal();
   }

   cancel() {
      this.refs.dialog.close();
   }

   delete() {
      axios.delete(`/api/-default-/public/alfresco/versions/1/people/{this.props.user.entry.id}`)
         .then(response => {
            if (response.status === 200)
            {
               this.refs.dialog.close();
               var changeEvent = new CustomEvent(customEvents.ITEM_CREATED, {
                  // detail: response
                  bubbles: true
               });
               this.refs.componentNode.dispatchEvent(changeEvent);
            }
            else
            {
               // TODO: Display an error
            }
         });
   }

   handleFormChange(value) {
      this.setState({
         user: value
      });
   }

   render() {
      return (<span ref="componentNode">
         <dialog ref="dialog" className="mdl-dialog">
            <h3 className="mdl-dialog__title">Delete {this.props.user.entry.firstName} {this.props.user.entry.lastName}</h3>
            <div className="mdl-dialog__content" style={DeleteUserButtonStyles.dialogContent}>
               <p>Are you sure you want to delete {this.props.user.entry.firstName} {this.props.user.entry.lastName}</p>
               <p>Deleting a user does not remove their permissions from the repository. These permissions will be reused if the user is recreated later. You can also disable the user account.</p>
            </div>
            <div className="mdl-dialog__actions">
               <button type="button" 
                       className="mdl-button"
                       onClick={this.delete.bind(this)}>Delete</button>
               <button type="button" 
                       className="mdl-button"
                       onClick={this.cancel.bind(this)}>Cancel</button>
           </div>
         </dialog>
         <button className="mdl-button mdl-js-button mdl-button--icon"
                 onClick={this.confirm.bind(this)}>
            <i className="material-icons">delete</i>
         </button>
      </span>)
   }
}

class ListView extends React.Component {

   delete(entry) {

   }

   render() {
      return ( <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                  <thead>
                     <tr>
                        <th className="mdl-data-table__cell--non-numeric">Name</th>
                        <th className="mdl-data-table__cell--non-numeric">Actions</th>
                     </tr>
                  </thead>
                  <tbody>{this.props.list.entries.map((entry) => 
                     <tr>
                        <td className="mdl-data-table__cell--non-numeric" onClick={() => this.props.navigationHandler(entry)} key={entry.entry.id}>{entry.entry.firstName} {entry.entry.lastName}</td>
                        <td className="mdl-data-table__cell--non-numeric">
                           <DeleteUserButton user={entry} />
                        </td>
                     </tr>
                  )}</tbody>
               </table>);
   }
}
 
class List extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         skipCount: 0,
         maxItems: 3,
         relativePath: "/",
         list: {
            entries: [],
            pagination: {
               skipCount: 0,
               maxItems: 3
            }
         }
      };

      this.navigate = this.navigate.bind(this);
      this.setRelativePath = this.setRelativePath.bind(this);
   }

   componentWillMount() {
      this.getData();
   }

   componentDidMount() {
      this.refs.list.addEventListener(customEvents.ITEM_CREATED, this.getData.bind(this));
      this.refs.list.addEventListener(customEvents.PAGE_BACKWARDS, this.pageBack.bind(this));
      this.refs.list.addEventListener(customEvents.PAGE_FORWARDS, this.pageForward.bind(this));

      window.componentHandler.upgradeElement(this.refs.list);
   }

   pageBack() {
      if (this.state.list.pagination.skipCount)
      {
         this.state.skipCount -= this.state.maxItems;
         this.getData();
      }
   }

   pageForward() {
      if (this.state.list.pagination.hasMoreItems)
      {
         this.state.skipCount += this.state.maxItems;
         this.getData();
      }
   }

   getData() {

      let url = `/api/-default-/public/alfresco/versions/1/people?skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}`;
      axios.get(url)
         .then(response => {
            this.setState({list: response.data.list});
         });
   }

   navigate(item) {
      if (item.entry.isFolder)
      {
         this.state.skipCount = 0;
         this.state.relativePath += `${item.entry.name}/`;
         this.getData();
      }
   }

   setRelativePath(relativePath) {
      this.state.skipCount = 0;
      this.state.relativePath = relativePath;
      this.getData();
   }

   render() {
      return (
         <div ref="list" >
            <Toolbar list={this.state.list} 
                     pageBackHandler={this.pageBack}
                     pageForwardHandler={this.pageForward}></Toolbar>
            <ListView list={this.state.list}
                      navigationHandler={this.navigate}></ListView>
         </div>)
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
         <form autocomplete="nope" onSubmit={this.handleSubmit}>
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
               var changeEvent = new CustomEvent(customEvents.ITEM_CREATED, {
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

class PaginationControls extends React.Component {

   pageBack() {
      let changeEvent = new CustomEvent(customEvents.PAGE_BACKWARDS, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   pageForward() {
      let changeEvent = new CustomEvent(customEvents.PAGE_FORWARDS, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      return (<span ref="componentNode">
         <button className="mdl-button mdl-js-button mdl-button--raised" 
                 disabled={this.props.list.pagination.skipCount ? false : true} 
                 onClick={this.pageBack.bind(this)}>Page Back</button>

         <span>{this.props.list.pagination.skipCount / this.props.list.pagination.maxItems + 1}</span>
         
         <button className="mdl-button mdl-js-button mdl-button--raised" 
                 disabled={this.props.list.pagination.hasMoreItems ? false : true} 
                 onClick={this.pageForward.bind(this)}>Page Forward</button>
      </span>)
   }
}


class Toolbar extends React.Component {

   render() {
      return ( <span>
                  <CreateUserButton/>
                  <PaginationControls list={this.props.list} 
                                      pageBackHandler={this.pageBack}
                                      pageForwardHandler={this.pageForward}/>
               </span>)
   }
}

const Home = React.createClass({

   render() {
      return (
         <div>
            <List></List>
         </div>
      )
   }
})

export default Home;