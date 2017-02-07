import React from "react";
import { withRouter } from "react-router";
import auth from "../utilities/Authentication";

const loginBoxStyle = {
   display: "flex",
   alignItems: "center",
   justifyContent: "center"
};

const Login = withRouter(
  React.createClass({

   componentDidMount() {
      window.componentHandler.upgradeDom();
      this.refs.username.focus();
   },

   getInitialState() {
      return {
        error: false
      }
    },

    handleSubmit(event) {
      event.preventDefault()

      const username = this.refs.username.value
      const pass = this.refs.pass.value

      auth.login(username, pass).then((loggedIn) => {
         if (!loggedIn)
         {
            this.setState({ error: true })
         }
         else
         {
            const { location } = this.props;
            if (location.state && location.state.nextPathname) 
            {
               this.props.router.replace(location.state.nextPathname);
            } 
            else 
            {
               this.props.router.replace('/nodes');
            }
         }
      });
    },

    render() {
      return (
         <div ref="componentNode" className="mdl-layout mdl-js-layout">
            <main style={loginBoxStyle} className="mdl-layout__content">
               <div className="mdl-card mdl-shadow--6dp">
                  <form onSubmit={this.handleSubmit}>
                     <div className="mdl-card__title mdl-color--primary mdl-color-text--white">
                        <h2 className="mdl-card__title-text">Alfresco</h2>
                     </div>
                     <div className="mdl-card__supporting-text">
                           <div className="mdl-textfield mdl-js-textfield">
                              <input ref="username" className="mdl-textfield__input" type="text" id="username" />
                              <label className="mdl-textfield__label" htmlFor="username">Username</label>
                           </div>
                           <div className="mdl-textfield mdl-js-textfield">
                              <input ref="pass" className="mdl-textfield__input" type="password" id="userpass" />
                              <label className="mdl-textfield__label" htmlFor="userpass">Password</label>
                           </div>
                           { this.state.error && 
                              (
                                 <p>Bad login information</p>
                              )
                           }
                     </div>
                     <div className="mdl-card__actions mdl-card--border">
                        <button type="submit" className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Log in</button>
                     </div>
                  </form>
               </div>
            </main>
         </div>

        
      )
    }
  })
)

export default Login;