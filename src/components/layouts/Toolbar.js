import React from "react";

import "./css/Toolbar.css";

class Toolbar extends React.Component {

   render() {
      return (
         <div className="alfresco_components_layouts_Toolbar">
            {this.props.children}
         </div>
      );
   }
}

export default Toolbar;