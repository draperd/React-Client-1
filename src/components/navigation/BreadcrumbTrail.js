import React from "react";
import { collectionEvents } from "../containers/Collection";
import BreadcrumbUtil from "alfresco-js-utils/lib/utils/navigation/Breadcrumbs";

class BreadcrumbTrail extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         breadcrumbs: [
            {
               label: "Home",
               relativePath: props.relativePath
            }
         ]
      };
   }

   navigate(relativePath) {
      let changeEvent = new CustomEvent(collectionEvents.RELATIVE_PATH, {
         detail: relativePath,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   componentWillReceiveProps(nextProps) {
      let breadcrumbData = BreadcrumbUtil.createBreadcrumbs({
         relativePath: nextProps.relativePath
      });
      this.setState({
         breadcrumbs: breadcrumbData.breadcrumbs
      });
   }

   render() {
      return (<nav ref="componentNode" role="navigation">
         <p id="breadcrumblabel">You are here:</p>
         <ol id="breadcrumb" aria-labelledby="breadcrumblabel">{this.state.breadcrumbs.map((breadcrumb) => 
            <li key={breadcrumb.relativePath}
                role="link" 
                onClick={() => this.navigate(breadcrumb.relativePath)}>{breadcrumb.label}</li>)}</ol>
      </nav>)
   }
}

export default BreadcrumbTrail