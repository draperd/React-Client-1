import React from "react";

class Drawer extends React.Component {

   render() {
      return (
         <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">{this.props.title}</span>
            <nav className="mdl-navigation">
               {this.props.children}
            </nav>
         </div>
      );
   }
}

export default Drawer;