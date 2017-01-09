import React from "react";
import NodeService from "alfresco-js-utils/lib/services/NodeService";

class BreadcrumbUtil {
   static createBreadcrumbs(input) {
      let lastPathElement = '/';
      let breadcrumbs = [{
         label: 'Home',
         relativePath: lastPathElement
      }];
      input.relativePath
         .split('/')
         .filter(function(name) {
            return name.trim() !== '';
         })
         .forEach(function(pathElement) {
            let currRelativePath = lastPathElement + pathElement + '/';
            breadcrumbs.push({
               label: pathElement,
               relativePath: currRelativePath
            });
            lastPathElement = currRelativePath;
         });
      return {
         lastPathElement: lastPathElement,
         breadcrumbs: breadcrumbs
      };
   }
}

class Breadcrumb extends React.Component {

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

   componentWillReceiveProps(nextProps) {
      let breadcrumbData = BreadcrumbUtil.createBreadcrumbs({
         relativePath: nextProps.relativePath
      });
      this.setState({
         breadcrumbs: breadcrumbData.breadcrumbs
      });
   }

   render() {
      return (<nav role="navigation">
         <p id="breadcrumblabel">You are here: {this.props.relativePath}</p>
         <ol id="breadcrumb" aria-labelledby="breadcrumblabel">{this.state.breadcrumbs.map((breadcrumb) => 
            <li role="link" onClick={() => this.props.relativePathHandler(breadcrumb.relativePath)}>{breadcrumb.label}</li>)}</ol>
      </nav>)
   }
}

class ListView extends React.Component {

   render() {
      return (<ul> {this.props.list.entries.map((entry) => 
         <li onClick={() => this.props.navigationHandler(entry)} key={entry.entry.id}>{entry.entry.name}</li>
      )}</ul>);
   }
}
 
class List extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         skipCount: 0,
         maxItems: 3,
         relativePath: "/",
         list: {
            entries: [],
            pagination: {
               skipCount: 0,
               maxItems: 3
            }
         }
      };

      this.pageBack = this.pageBack.bind(this);
      this.pageForward = this.pageForward.bind(this);
      this.navigate = this.navigate.bind(this);
      this.setRelativePath = this.setRelativePath.bind(this);
   }

   componentWillMount() {
      this.getData();
   }

   pageBack() {
      if (this.state.list.pagination.skipCount)
      {
         this.state.skipCount -= this.state.maxItems;
         this.getData();
      }
   }

   pageForward() {
      if (this.state.list.pagination.hasMoreItems)
      {
         this.state.skipCount += this.state.maxItems;
         this.getData();
      }
   }

   getData() {
      NodeService.getItems({
         skipCount: this.state.skipCount,
         maxItems: this.state.maxItems,
         relativePath: this.state.relativePath
      })
         .then(response => {
            this.setState({list: response.data.list});
         });
   }

   navigate(item) {
      if (item.entry.isFolder)
      {
         this.state.skipCount = 0;
         this.state.relativePath += `${item.entry.name}/`;
         this.getData();
      }
   }

   setRelativePath(relativePath) {
      this.state.skipCount = 0;
      this.state.relativePath = relativePath;
      this.getData();
   }

   render() {
      return (
         <div>
            <Breadcrumb relativePath={this.state.relativePath}
                        relativePathHandler={this.setRelativePath}></Breadcrumb>
            <Toolbar list={this.state.list} 
                     pageBackHandler={this.pageBack}
                     pageForwardHandler={this.pageForward}></Toolbar>
            <ListView list={this.state.list}
                      navigationHandler={this.navigate}></ListView>
         </div>)
   }
}

class Toolbar extends React.Component {

   render() {
      return (<span>
         <button onClick={this.props.pageBackHandler}>Page Back</button>
         <span>{this.props.list.pagination.skipCount / this.props.list.pagination.maxItems + 1}</span>
         <button onClick={this.props.pageForwardHandler}>Page Forward</button>
      </span>)
   }
}

const Home = React.createClass({

   render() {
      return (
         <div>
            <List></List>
         </div>
      )
   }
})

export default Home;