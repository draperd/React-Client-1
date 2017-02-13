import React from "react";
import { withRouter } from "react-router";
import auth from "../utilities/Authentication";

import { injectIntl } from "react-intl";
import { merge } from "lodash";

// Import the language bundles that we know about...
import en from "./i18n/Login.en.json";
import es from "./i18n/Login.es.json";
import esES from "./i18n/Login.es-ES.json";

// Locale variable to the module to ensure that bundles are only merged once...
let i18nMerged = false;

// Create the i18n data (the appropriate data for the locale will be selected at runtime)...
const i18nData = {
   en: en,
   es: es,
   "es-ES": esES
};


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

      // Merge the locale bundle for this component. The default locale, the language
      // and the region specific language are all merged so that more specific messages
      // can override less specific (or missing) messages...
      const languageWithoutRegionCode = this.props.intl.locale.split(/[_-]+/)[0];
      if (!i18nMerged)
      {
         merge(this.props.intl.messages, i18nData[this.props.intl.defaultLocale] || {});
         merge(this.props.intl.messages, i18nData[languageWithoutRegionCode] || {});
         merge(this.props.intl.messages, i18nData[this.props.intl.locale] || {});
         i18nMerged = true;
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