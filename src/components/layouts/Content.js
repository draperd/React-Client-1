import React from "react";

class Content extends React.Component {

   render() {
      return (
         <main className="mdl-layout__content">
            <div className="page-content" data-dojo-attach-point="contentNode">
               {this.props.children}
            </div>
         </main>
      );
   }
}

export default Content;