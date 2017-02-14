/**
 * @module
 */
import React from "react";
import { injectIntl } from "react-intl";
import { merge } from "lodash";

const registry = {};

/**
 * This is a higher order component enhancer function that will enable a component to load
 * its locale bundles (default, general locale and region specific locale) into the 
 * main messages bundle for the application. 
 *
 * @function
 * @param  {Component} WrappedComponent The component to enhance
 * @param  {string}    componentName The name of the component to enhance (required to lookup the bundles)
 * @param  {Object}    req This is the require context for the component (always pass require.context("./i18n", false))
 * @return {Component} The original component enhanced with i18n bundles.
 */
function withI18n(WrappedComponent, componentName, req) {

   return injectIntl(class extends React.Component {
      constructor(props) {
         super(props);

         if (!registry.WrappedComponent)
         {
            let componentMessages;
            try {
               componentMessages = req(`./${componentName}.${this.props.intl.defaultLocale}.json`);
               merge(this.props.intl.messages, componentMessages);
            }
            catch (e) {}

            try {
               const languageWithoutRegionCode = this.props.intl.locale.split(/[_-]+/)[0];
               componentMessages = req(`./${componentName}.${languageWithoutRegionCode}.json`);
               merge(this.props.intl.messages, componentMessages);
            }
            catch (e) {}

            try {
               componentMessages = req(`./${componentName}.${this.props.intl.locale}.json`);
               merge(this.props.intl.messages, componentMessages);
            }
            catch(e) {}

            registry[WrappedComponent] = true;
         }
         
      }

      render() {
         return <WrappedComponent {...this.props} />;
      }
   });
};

export default withI18n;