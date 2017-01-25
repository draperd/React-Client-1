import React from "react";

class Header extends React.Component {

   render() {
      return (
         <header className="mdl-layout__header ">
            <div className="mdl-layout__header-row" >
               <span className="mdl-layout-title">{this.props.title}</span>
               <div className="mdl-layout-spacer"></div>
               {this.props.children}
            </div>
         </header>
      );
   }
}

export default Header;