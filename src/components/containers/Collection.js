/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";
import queryString from "query-string";

/**
 * The names of the {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent|Custom Events} that
 * are listened to by the [Collection component]{@link module:components/containers/Collection~Collection}.
 * 
 * @static
 * @type {object}
 * @property {string} ITEM_CREATED Indicates that a new item has been added to the collection 
 *                                 (handled by [getData]{@link module:components/containers/Collection~Collection#getData})
 * @property {string} PAGE_FORWARDS Indicates that the user wishes to move to the next page of data 
 *                                  (handled by [pageForward]{@link module:components/containers/Collection~Collection#pageForward})
 * @property {string} PAGE_BACKWARDS Indicates that the user wishes to move to the previous page of data 
 *                                   (handled by [pageBack]{@link module:components/containers/Collection~Collection#pageBack})
 * @property {string} UPDATE_MAX_ITEMS Indicates the user wishes to change the number of items displayed per page 
 *                                     (handled by [updateMaxItems]{@link module:components/containers/Collection~Collection#updateMaxItems})
 * @property {string} ITEM_UPDATED Indicates that an item in the collection has been updated
 *                                 (handled by [getData]{@link module:components/containers/Collection~Collection#getData})
 * @property {string} REORDER Indicates that the user wishes to change the order that the items are displayed in
 *                            (handled by [reorderItems]{@link module:components/containers/Collection~Collection#reorderItems})
 * @property {string} FILTER Indicates that the user wishes to filter the displayed data
 *                           (handled by [filterItems]{@link module:components/containers/Collection~Collection#filterItems})
 * @property {string} NAVIGATE Indicates that the user wishes to navigate "into" a displayed item
 *                            (handled by [navigate]{@link module:components/containers/Collection~Collection#navigate})
 * @property {string} RELATIVE_PATH Indicates that the user wishes to change the path to the displayed data
 *                                  (handled by [setRelativePath]{@link module:components/containers/Collection~Collection#setRelativePath})
 */
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
 * list, relations, orderBy, orderDirection and relativePath properties. Nested components can trigger changes in
 * state by emitting an event that will trigger the loading of new data and updated properties will be
 * cascaded through all the nested components to allow react rendering.</p>
 *
 * @example <caption>Collection of Nodes</caption>
 * <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" 
 *             orderBy="name"
 *             include="properties">
 *     
 *     <BreadcrumbTrail/>
 *     
 *     <TableView>
 *
 *        <TableViewHead> 
 *           <TableHeading label="Thumbnail" />
 *           <TableHeading label="Name" orderById="name" />
 *           <TableHeading label="Created By" orderById="createdByUser.displayName" />
 *           <TableHeading label="Created On" orderById="createdAt" />
 *           <TableHeading label="Is Folder"/>
 *        </TableViewHead>
 *
 *        <TableViewBody>
 *           <TableCell >
 *              <Thumbnail></Thumbnail>
 *           </TableCell>
 *           <TableCell property="name" navigation={true} view={true}/>
 *           <TableCell property="createdByUser.displayName" />
 *           <TableCell property="createdAt" renderAs="DATE" />
 *           <TableCell property="isFolder" />
 *        </TableViewBody>
 *        
 *        <TableViewFoot>
 *           <TableCell colspan="6">
 *              <Pagination />
 *           </TableCell>
 *        </TableViewFoot>
 *
 *     </TableView>
 *  </Collection>
 *
 * @class
 * 
 */
class Collection extends React.Component {

   /**
    * Creates new Collection component
    * 
    * @constructor
    * @param {object} props
    * @param {string} [props.url="/api/-default-/public/alfresco/versions/1/people"] The URL to use when making data requests
    * @param {string} [props.filterUrl="/api/-default-/public/alfresco/versions/1/queries/people"] The URL to use when filtering the displayed data
    * @param {number} [props.skipCount=0] The number of items to skip over when requesting data (used for pagination)
    * @param {number} [props.maxItems=5] The maximum number of items to retrieve (essentially the page size)
    * @param {string} [props.orderBy="id"] The property to initially order the results by
    * @param {string} [props.orderDirection="ASC"] The direction to initially order results in, must be either "ASC" or "DESC"
    * @param {string} [props.relativePath="/"] Any relative path to apply (applies when retrieving data from a hierarchy, e.g. Nodes)
    * @param {string} [props.include=""] Additional data to include in the retrieved data (see the API used for details of what is available)
    * @param {string} [props.relations=""] Additional relations to include in the retrieved data (see the API used for details of what is available)
    * @param {string} [props.includeSource="true"] Indicates whether or not data about the source object should be returned
    * @param {string} [props.useHash="false"] Indicates whether or not the URL hash should be used for the relativePath
    */
   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.filterUrl = props.filterUrl || "/api/-default-/public/alfresco/versions/1/queries/people";
      this.include = props.include ? `&include=${props.include}` : "";
      this.relations = props.relations ? `&relations=${props.relations}` : "";
      this.includeSource = (props.includeSource && props.includeSource.toString().toLowerCase() === "true") ? "&includeSource=true" : "";

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
         },
         relations: {}
      };
   }

   /**
    * Calls [getData]{@link module:components/containers/Collection~Collection#getData} to retrieve some
    * initial data.
    * 
    * @instance
    */
   componentWillMount() {

      if (this.props.useHash)
      {
         const parsedHash = queryString.parse(window.location.hash);
         this.setState({
            relativePath: parsedHash.relativePath || "/"
         }, () => {
            this.getData();
         });
      }
      else
      {
         this.getData();
      }
   }

   /**
    * Sets up all the event listeners required to trigger state updates. Each of the properties in 
    * the [collectionEvents]{@link module:components/containers/Collection.collectionEvents} object
    * will have a listener created for it.
    * 
    * @instance
    */
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


      if (this.props.useHash)
      {
         window.addEventListener("hashchange", (event) => {
            const parsedHash = queryString.parse(window.location.hash);
            this.setState({
               relativePath: parsedHash.relativePath || "/"
            }, () => {
               this.getData();
            });
         });
      }
   }

   /**
    * Makes an XHR request using the configured url property.
    * 
    * @instance
    */
   getData() {
      let url = `${this.url}?relativePath=${this.state.relativePath}&skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection} ${this.include}${this.relations}${this.includeSource}`;
      xhr.get(url)
         .then(response => {
            this.setState({
               list: response.data.list,
               relations: response.data.relations || {}
            });
         });
   }

   /**
    * Triggered by the "FILTER" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This will make an XHR request that includes a "term" request
    * parameter assigned the value taken from the emitted events "detail.term" attribute.
    * 
    * @instance
    */
   filterItems(event) {
      if (event && event.detail && event.detail.term && event.detail.term.length > 1)
      {
         this.setState({
            skipCount: 0,
            orderDirection: this.state.orderDirection === "ASC" ? "DESC" : "ASC"
         }, () => {
            let url = `${this.filterUrl}?term=${event.detail.term}&skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection} ${this.include}`;
            xhr.get(url)
               .then(response => {
                  this.setState({
                     list: response.data.list,
                     relations: response.data.relations || {}
                  });
               });
         });
      }
      else
      {
         this.getData();
      }
   }

   /**
    * Triggered by the "REORDER" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This updates the "orderBy" attribute in the Component state using
    * the value taken from the emitted events "detail.orderBy" attribute. The "orderDirection" attribute in the 
    * state will be updated if provided. The [getData]{@link module:components/containers/Collection~Collection#getData}
    * function will then be called to retrieve new data sorted as requested.
    * 
    * @instance
    */
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

   /**
    * Triggered by the "UPDATE_MAX_ITEMS" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This updates the "maxItems" attribute in the Component state using
    * the value taken from the emitted events "detail.maxItems" attribute. 
    * The [getData]{@link module:components/containers/Collection~Collection#getData} function will then be called to 
    * retrieve new data that includes (up to) the requested maximum number of items.
    * 
    * @instance
    */
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

   /**
    * Triggered by the "PAGE_BACKWARDS" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This will decrement the "skipCount" state of the component by
    * the current "maxItems" state value (providing that it is no already at 0) and then call 
    * [getData]{@link module:components/containers/Collection~Collection#getData} to retrieve the previous page of data.
    * 
    * @instance
    */
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

   /**
    * Triggered by the "PAGE_FORWARDS" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This will increment the "skipCount" state of the component by
    * the current "maxItems" state value (providing that list.pagination.hasMoreItems is true) and then call 
    * [getData]{@link module:components/containers/Collection~Collection#getData} to retrieve the next page of data.
    * 
    * @instance
    */
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

   /**
    * Triggered by the "NAVIGATE" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This will append the "detail.entry.name" attribute of the emitted
    * event to the "relativePath" attribute of the component state (providing that the "detail.entry.isFolder") attribute
    * of the event is true) and then call [getData]{@link module:components/containers/Collection~Collection#getData} 
    * to retrieve the data for the new path.
    * 
    * @instance
    */
   navigate(event) {
      if (event && event.detail && event.detail.entry.isFolder)
      {
         let relativePath = `${this.state.relativePath}${event.detail.entry.name}/`;
         if (this.props.useHash)
         {
            window.history.pushState(null, null, "#relativePath=" + relativePath);
         }

         this.setState({
            skipCount: 0,
            relativePath: relativePath
         }, () => {
            this.getData();
         });
      }
   }

   /**
    * Triggered by the "RELATIVE_PATH" [collectionEvents]{@link module:components/containers/Collection.collectionEvents}
    * property being emitted by a nested component. This will set the "relativePath" attribute of the component state 
    * to the "detail" attribute of the emitted event and then call 
    * [getData]{@link module:components/containers/Collection~Collection#getData} to retrieve the data for the new path.
    * 
    * @instance
    */
   setRelativePath(event) {
      if (event && event.detail)
      {
         if (this.props.useHash)
         {
            window.history.pushState(null, null, "#relativePath=" + event.detail);
         }

         this.setState({
            skipCount: 0,
            relativePath: event.detail
         }, () => {
            this.getData();
         });
      }
   }

   /**
    * Updates the nested component children with properties for the list, relations, orderBy, orderDirection and relativePath 
    * state attributes and then renders them.
    * 
    * @return {JSX}
    */
   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         list: this.state.list,
         relations: this.state.relations,
         orderBy: this.state.orderBy,
         orderDirection: this.state.orderDirection,
         relativePath: this.state.relativePath,
         url: this.url
      }));
      return (
         <div ref="list" >
            {childrenWithProps}
         </div>)
   }
}

export default Collection;