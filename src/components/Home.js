import React from "react";
import axios from "axios";

const customEvents = {
   ITEM_CREATED: "itemCreated",
   PAGE_FORWARDS: "pageForward",
   PAGE_BACKWARDS: "pageBackward",
   UPDATE_MAX_ITEMS: "updateMaxItems",
   ITEM_UPDATED: "itemUpdate",
   REORDER: "reorderItems",
   FILTER: "filterItems"
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

class EnableUserToggle extends React.Component {

   constructor(props) {
      super(props);
      this.toggleId = this.props.user.entry.id + "_enabledToggle";
   }

   onToggle(event) {
      axios.put(`/api/-default-/public/alfresco/versions/1/people/${this.props.user.entry.id}`, {
         enabled: this.refs.toggle.checked
      })
         .then(response => {
            if (response.status === 200)
            {
               var changeEvent = new CustomEvent(customEvents.ITEM_UPDATED, {
                  bubbles: true
               });
               this.refs.toggle.dispatchEvent(changeEvent);
            }
         })
   }

   componentDidMount() {
      window.componentHandler.upgradeElement(this.refs.componentNode);
   }

   render() {
      return (
         <label ref="componentNode" className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor={this.toggleId}>
            <input type="checkbox" 
                   ref="toggle"
                   id={this.toggleId} 
                   className="mdl-switch__input" 
                   checked={this.props.user.entry.enabled} 
                   onChange={this.onToggle.bind(this)} />
            <span className="mdl-switch__label"></span>
         </label>
      );
   }
}

class TableHeading extends React.Component {

   orderBy() {
      var changeEvent = new CustomEvent(customEvents.REORDER, {
         detail: {
            orderBy: this.props.orderById
         },
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      let sortIndicator = "";
      if (this.props.orderById === this.props.orderBy)
      {
         let icon = this.props.orderDirection === "ASC" ? "arrow_upward" : "arrow_downward";
         sortIndicator = <button className="mdl-button mdl-js-button mdl-button--icon">
            <i className="material-icons">{icon}</i>
         </button>
      }
      return (
         <th ref="componentNode" className="mdl-data-table__cell--non-numeric" 
             onClick={this.orderBy.bind(this)}>{sortIndicator}{this.props.label}</th>
      );
   }
}



class ListView extends React.Component {

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
               <tr>
                  <td className="mdl-data-table__cell--non-numeric" onClick={() => this.props.navigationHandler(entry)} key={entry.entry.id}>{entry.entry.firstName} {entry.entry.lastName}</td>
                  <td className="mdl-data-table__cell--non-numeric">{entry.entry.id}</td>
                  <td className="mdl-data-table__cell--non-numeric">{entry.entry.email}</td>
                  <td className="mdl-data-table__cell--non-numeric">
                     <EnableUserToggle user={entry} />
                  </td>
                  <td className="mdl-data-table__cell--non-numeric">
                     <DeleteUserButton user={entry} />
                  </td>
               </tr>
            )}</tbody>
            <tfoot>
               <tr>
                  <td colSpan="5">
                     <PaginationControls list={this.props.list}/>
                  </td>
               </tr>
            </tfoot>
         </table>);
   }
}

class Filter extends React.Component {

   onChange(event) {
      var changeEvent = new CustomEvent(customEvents.FILTER, {
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
            <label className="mdl-textfield__label" for="filter">Search...</label>
         </div>
      );
   }
}
 
class List extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         skipCount: 0,
         maxItems: 5,
         relativePath: "/",
         orderBy: "firstName",
         orderDirection: "ASC",
         list: {
            entries: [],
            pagination: {
               skipCount: 0,
               maxItems: 5
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
      this.refs.list.addEventListener(customEvents.ITEM_UPDATED, this.getData.bind(this));
      this.refs.list.addEventListener(customEvents.PAGE_BACKWARDS, this.pageBack.bind(this));
      this.refs.list.addEventListener(customEvents.PAGE_FORWARDS, this.pageForward.bind(this));
      this.refs.list.addEventListener(customEvents.UPDATE_MAX_ITEMS, this.updateMaxItems.bind(this));
      this.refs.list.addEventListener(customEvents.REORDER, this.reorderItems.bind(this));
      this.refs.list.addEventListener(customEvents.FILTER, this.filterItems.bind(this));

      window.componentHandler.upgradeElement(this.refs.list);
   }

   filterItems(event) {
      if (event && event.detail && event.detail.term && event.detail.term.length > 1)
      {
         this.state.skipCount = 0;
         let url = `/api/-default-/public/alfresco/versions/1/queries/people?term=${event.detail.term}&skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection}`;
         axios.get(url)
            .then(response => {
               this.setState({list: response.data.list});
            });
      }
      else
      {
         this.getData();
      }
   }

   reorderItems(evt) {
      if (evt && evt.detail.orderBy)
      {
         this.state.orderBy = evt.detail.orderBy;
         this.state.orderDirection = this.state.orderDirection === "ASC" ? "DESC" : "ASC";
         this.getData();
      }
   }

   updateMaxItems(evt) {
      if (evt && evt.detail)
      {
         this.state.maxItems = evt.detail;
         this.getData();
      }
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

      let url = `/api/-default-/public/alfresco/versions/1/people?skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection}`;
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
            <Filter />
            <ListView list={this.state.list}
                      navigationHandler={this.navigate}
                      orderBy={this.state.orderBy}
                      orderDirection={this.state.orderDirection}></ListView>
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

   updateMaxItems(maxItems) {
      let changeEvent = new CustomEvent(customEvents.UPDATE_MAX_ITEMS, {
         detail: maxItems,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      return (<div ref="componentNode">
         
         <span>Results per page:</span>

         <span>{this.props.list.pagination.maxItems}</span>

         <button id="paginationItemsPerPage"
                 className="mdl-button mdl-js-button mdl-button--icon" 
                 onClick={this.pageBack.bind(this)}>
            <i className="material-icons">arrow_drop_down</i>
         </button>

         <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
             htmlFor="paginationItemsPerPage">
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(5)}>5</li>
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(10)}>10</li>
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(20)}>20</li>
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(50)}>50</li>
         </ul>

         <span>{this.props.list.pagination.skipCount + 1} - {this.props.list.pagination.skipCount + this.props.list.pagination.maxItems} of {this.props.list.pagination.totalItems}</span>

         <button className="mdl-button mdl-js-button mdl-button--icon" 
                 disabled={this.props.list.pagination.skipCount ? false : true} 
                 onClick={this.pageBack.bind(this)}>
            <i className="material-icons">keyboard_arrow_left</i>
         </button>

         <button className="mdl-button mdl-js-button mdl-button--icon" 
                 disabled={this.props.list.pagination.hasMoreItems ? false : true} 
                 onClick={this.pageForward.bind(this)}>
            <i className="material-icons">keyboard_arrow_right</i>
         </button>
      </div>)
   }
}


class Toolbar extends React.Component {

   render() {
      return ( <span>
                  <CreateUserButton/>
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