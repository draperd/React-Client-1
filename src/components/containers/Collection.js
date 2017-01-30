/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";

const collectionEvents = {
   ITEM_CREATED: "itemCreated",
   PAGE_FORWARDS: "pageForward",
   PAGE_BACKWARDS: "pageBackward",
   UPDATE_MAX_ITEMS: "updateMaxItems",
   ITEM_UPDATED: "itemUpdate",
   REORDER: "reorderItems",
   FILTER: "filterItems",
   NAVIGATE: "navigate",
   RELATIVE_PATH: "relativePath"
};
export { collectionEvents };

/**
 * <p>This component can be used to render the response from a call to a REST API that returns a list
 * of items. Any components that are nested as children of this component will automatically be assigned
 * list, orderBy, orderDirection and relativePath properties. Nested components can trigger changes in
 * state by emitting an event that will trigger the loading of new data and updated properties will be
 * cascaded through all the nested components to allow react rendering.</p>
 * 
 * @class
 */
class Collection extends React.Component {

   /**
    * Creates new Collection component
    * 
    * @instance
    * @param {object} props
    * @param {string} [props.url="/api/-default-/public/alfresco/versions/1/people"] The URL to use when making data requests
    * @param {string} [props.filterUrl="/api/-default-/public/alfresco/versions/1/queries/people"] The URL to use when filtering the displayed data
    * @param {number} [props.skipCount=0] The number of items to skip over when requesting data (used for pagination)
    * @param {number} [props.maxItems=5] The maximum number of items to retrieve (essentially the page size)
    * @param {string} [props.orderBy="id"] The property to initially order the results by
    * @param {string} [props.orderDirection="ASC"] The direction to initially order results in, must be either "ASC" or "DESC"
    * @param {string} [props.relativePath="/"] Any relative path to apply (applies when retrieving data from a hierarchy, e.g. Nodes)
    * @param {string} [props.include=""] Additional data to include in the retrieved data (see the API used for details of what is available)
    */
   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.filterUrl = props.filterUrl || "/api/-default-/public/alfresco/versions/1/queries/people";
      this.include = props.include || "";

      this.state = {
         skipCount: props.skipCount || 0,
         maxItems: props.maxItems || 5,
         relativePath: props.relativePath || "/",
         orderBy: props.orderBy || "id",
         orderDirection: props.orderDirection === "DESC" ? "DESC" : "ASC",
         list: {
            entries: [],
            pagination: {
               skipCount: 0,
               maxItems: 5
            }
         }
      };
   }

   componentWillMount() {
      this.getData();
   }

   componentDidMount() {
      this.refs.list.addEventListener(collectionEvents.ITEM_CREATED, this.getData.bind(this));
      this.refs.list.addEventListener(collectionEvents.ITEM_UPDATED, this.getData.bind(this));
      this.refs.list.addEventListener(collectionEvents.PAGE_BACKWARDS, this.pageBack.bind(this));
      this.refs.list.addEventListener(collectionEvents.PAGE_FORWARDS, this.pageForward.bind(this));
      this.refs.list.addEventListener(collectionEvents.UPDATE_MAX_ITEMS, this.updateMaxItems.bind(this));
      this.refs.list.addEventListener(collectionEvents.REORDER, this.reorderItems.bind(this));
      this.refs.list.addEventListener(collectionEvents.FILTER, this.filterItems.bind(this));
      this.refs.list.addEventListener(collectionEvents.NAVIGATE, this.navigate.bind(this));
      this.refs.list.addEventListener(collectionEvents.RELATIVE_PATH, this.setRelativePath.bind(this));
   }

   filterItems(event) {
      if (event && event.detail && event.detail.term && event.detail.term.length > 1)
      {
         this.setState({
            skipCount: 0,
            orderDirection: this.state.orderDirection === "ASC" ? "DESC" : "ASC"
         }, () => {
            let url = `${this.filterUrl}?term=${event.detail.term}&skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection}&include=${this.include}`;
            xhr.get(url)
               .then(response => {
                  this.setState({list: response.data.list});
               });
         });
      }
      else
      {
         this.getData();
      }
   }

   reorderItems(evt) {
      if (evt && evt.detail.orderBy)
      {
         this.setState({
            orderBy: evt.detail.orderBy,
            orderDirection: this.state.orderDirection === "ASC" ? "DESC" : "ASC"
         }, () => {
            this.getData();
         });
      }
   }

   updateMaxItems(evt) {
      if (evt && evt.detail)
      {
         this.setState({
            maxItems: evt.detail
         }, () => {
            this.getData();
         });
      }
   }

   pageBack() {
      if (this.state.list.pagination.skipCount)
      {
         this.setState({
            skipCount: this.state.skipCount - this.state.maxItems
         }, () => {
            this.getData();
         });
      }
   }

   pageForward() {
      if (this.state.list.pagination.hasMoreItems)
      {
         this.setState({
            skipCount: this.state.skipCount + this.state.maxItems
         }, () => {
            this.getData();
         });
      }
   }

   getData() {

      let url = `${this.url}?relativePath=${this.state.relativePath}&skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection}&include=${this.include}`;
      xhr.get(url)
         .then(response => {
            this.setState({list: response.data.list});
         });
   }

   navigate(event) {
      if (event && event.detail && event.detail.entry.isFolder)
      {
         this.setState({
            skipCount: 0,
            relativePath: `${this.state.relativePath}${event.detail.entry.name}/`
         }, () => {
            this.getData();
         });
      }
   }

   setRelativePath(event) {
      if (event && event.detail)
      {
         this.setState({
            skipCount: 0,
            relativePath: event.detail
         }, () => {
            this.getData();
         });
      }
   }

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         list: this.state.list,
         orderBy: this.state.orderBy,
         orderDirection: this.state.orderDirection,
         relativePath: this.state.relativePath
      }));
      return (
         <div ref="list" >
            {childrenWithProps}
         </div>)
   }
}

export default Collection;