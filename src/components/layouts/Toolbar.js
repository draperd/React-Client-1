import React from "react";

import "./css/Toolbar.css";

class Toolbar extends React.Component {

   render() {
      // NOTE: It's not ideal to be doing this here because a toolbar is not necessarily
      //       always going to be nested within a collection. A better approach may be to
      //       allow a mapping of properties, however for pure convenience this is likely to
      //       be very useful.
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         list: this.props.list,
         relations: this.props.relations,
         orderBy: this.props.orderBy,
         orderDirection: this.props.orderDirection,
         relativePath: this.props.relativePath
      }));
      
      return (
         <div className="alfresco_components_layouts_Toolbar">
            {childrenWithProps}
         </div>
      );
   }
}

export default Toolbar;