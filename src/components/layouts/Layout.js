import React from "react";

class Layout extends React.Component {

   componentDidMount() {
      // window.componentHandler.upgradeElement(this.refs.componentNode);
      window.componentHandler.upgradeDom();
   }

   render() {
      return (
         <div ref="componentNode" className="mdl-layout__container">
            <div className="mdl-layout mdl-js-layout">
               {this.props.children}
            </div>
         </div>
      )
   }
}

export default Layout;