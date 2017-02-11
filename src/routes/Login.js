import React from "react";
import { withRouter } from "react-router";
import auth from "../utilities/Authentication";

import { injectIntl } from "react-intl";
import { merge } from "lodash";


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

      // The following code attempts to load the current message bundle for the current locale
      // for this component. It first tries the main locale (i.e. "es-ES") then tries the 
      // locale without the region code (i.e. "es") and finally falls back to the default
      // locale (i.e. "en"). When a message bundle has been loaded the messages are merged
      // into the main bundle.
      // 
      // TODO: This shouldn't be done for every call to render, there needs to be some 
      //       singleton attribute or registry that ensures this is only done once for 
      //       each component instance. 
      //       
      // TODO: Ideally we'd want to abstract this code, possibly to a HOC, but there are 
      //       issues with handling the variable paths.
      try 
      {
         const componentMessages = require(`./i18n/Login.${this.props.intl.locale}.json`);
         merge(this.props.intl.messages, componentMessages);
      }
      catch (e) 
      {
         try 
         {
            const languageWithoutRegionCode = this.props.intl.locale.split(/[_-]+/)[0];
            const componentMessages = require(`./i18n/Login.${languageWithoutRegionCode}.json`);
            merge(this.props.intl.messages, componentMessages);
         }
         catch (e)
         {
            const componentMessages = require(`./i18n/Login.${this.props.intl.defaultLocale}.json`);
            merge(this.props.intl.messages, componentMessages);
         }
      }

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
                              <label className="mdl-textfield__label" htmlFor="username">{this.props.intl.formatMessage({id:"routes.login.userName"})}</label>
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

export default injectIntl(Login);