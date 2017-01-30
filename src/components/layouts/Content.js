/**
 * @module
 */
import React from "react";

/**
 * This component provides a container for the content of an application route. It is intended to be used as the
 * outer component in the render function of an application route component. This means that it will be nested
 * within the [MainLayout]{@link module:routes/MainLayout~MainLayout} component. 
 * 
 * @class
 */
class Content extends React.Component {

   /**
    * @instance
    */
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