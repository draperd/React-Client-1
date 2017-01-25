import React from "react";

class Layout extends React.Component {

   render() {
      return (
         <div className="mdl-layout mdl-js-layout">
            {this.props.children}
         </div>
      )
   }
}

export default Layout;