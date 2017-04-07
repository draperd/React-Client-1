import React from "react";
import { render } from "react-dom";
import { browserHistory, Router, Route, IndexRoute } from "react-router";

import { IntlProvider, addLocaleData } from "react-intl";

// It is necessary to import all of the locales that you wish to support...
import de from "react-intl/locale-data/de";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import fr from "react-intl/locale-data/fr";
import it from "react-intl/locale-data/it";
import ja from "react-intl/locale-data/ja";
import nb from "react-intl/locale-data/nb";
import nl from "react-intl/locale-data/nl";
import pt from "react-intl/locale-data/pt";
import ru from "react-intl/locale-data/ru";
import zh from "react-intl/locale-data/zh";
addLocaleData([...de, ...en, ...es, ...fr, ...it, ...ja, ...nb, ...nl, ...pt, ...ru, ...zh]); // Add additional locale data as necessary

// Load the global messages for the locales that you want to support, individual
// components will add their own messages on demand (add additional bundles as necessary)
import deMessages from "./i18n/de.json";
import enMessages from "./i18n/en.json";
import esMessages from "./i18n/es.json";
import frMessages from "./i18n/fr.json";
import itMessages from "./i18n/it.json";
import jaMessages from "./i18n/ja.json";
import nbMessages from "./i18n/nb.json";
import nlMessages from "./i18n/nl.json";
import ptMessages from "./i18n/pt_BR.json";
import ruMessages from "./i18n/ru.json";
import zhMessages from "./i18n/zh_CN.json";

// Determine user language. Different browsers have the user locale defined
// on different fields on the "navigator" object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

// Split locales with a region code (only necessary when selecting language from data)...
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
// const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

let messages = enMessages;
switch (languageWithoutRegionCode) {
    case "de":
        messages = deMessages;
        break;
    case "en":
        messages = enMessages;
        break;
    case "es":
        messages = esMessages;
        break;
    case "fr":
        messages = frMessages;
        break;
    case "it":
        messages = itMessages;
        break;
    case "ja":
        messages = jaMessages;
        break;
    case "nb":
        messages = nbMessages;
        break;
    case "nl":
        messages = nlMessages;
        break;
    case "pt":
        messages = ptMessages;
        break;
    case "ru":
        messages = ruMessages;
        break;
    case "zh":
        messages = zhMessages;
        break;
    default:
        break;
}


// Importing Material Design Lite CSS and JS dependencies to provide the UX for
// the application...
import "material-design-lite/material.css";
require("material-design-lite");

import auth from "./utilities/Authentication";

// This Component is used to handle user login...
import Login from "./routes/Login";

// This Component provides the main layout for the application, this comprises of
// the header and drawer. All other routers are nested within this layout to avoid
// code duplication...
import MainLayout from "./routes/MainLayout";

// These Components represent the routes available for authenticated users within
// the application. These are each nested within the MainLayout and are mapped to
// specific paths...
import Users from "./routes/Users";
import Nodes from "./routes/Nodes";
import NodeDetails from "./routes/NodeDetails";
import FilmStrip from "./routes/FilmStrip";
import Sites from "./routes/Sites";
import Tags from "./routes/Tags";
import LiveSearch from "./routes/LiveSearch";
import Search from "./routes/Search";

// A simple function used to ensure that the main routes cannot be accessed by
// unauthenticated users. If the user is not logged in then they will be automatically
// redirected to the login page...
function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: "/login",
            state: { nextPathname: nextState.location.pathname }
        });
    }
}

// This sets up the routes for the application...
// You can add your own routes within the MainLayout (if you want a link to your route
// to appear in the navigation drawer then you should edit MainLayout.js to add the link)....
render((
    <IntlProvider locale={language} messages={messages} >
    <Router history={browserHistory}>
    <Route path="login" component={Login} />
    <Route path="/" component={MainLayout} onEnter={requireAuth}>
    <IndexRoute component={Nodes} onEnter={requireAuth} />
    <Route path="nodes" component={Nodes} onEnter={requireAuth} />
    <Route path="livesearch" component={LiveSearch} onEnter={requireAuth} />
    <Route path="users" component={Users} onEnter={requireAuth} />
    <Route path="filmstrip" component={FilmStrip} onEnter={requireAuth} />
    <Route path="sites" component={Sites} onEnter={requireAuth} />
    <Route path="tags" component={Tags} onEnter={requireAuth} />
    <Route path="search" component={Search} onEnter={requireAuth} />
    <Route path="node/:id" component={NodeDetails} onEnter={requireAuth} />
    </Route>
    </Router>
    </IntlProvider>
), document.getElementById('root'))
