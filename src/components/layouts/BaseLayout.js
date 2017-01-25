import React from "react";

class BaseLayout extends React.Component {

   componentDidMount() {
      window.componentHandler.upgradeElement(this.refs.componentNode);
   }

   render() {
      return (
         <div ref="componentNode" className="mdl-layout__container">
            {this.props.children}
         </div>
      )
   }
}

export default BaseLayout;