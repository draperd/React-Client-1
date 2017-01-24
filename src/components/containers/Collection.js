import React from "react";
import axios from "axios";

const collectionEvents = {
   ITEM_CREATED: "itemCreated",
   PAGE_FORWARDS: "pageForward",
   PAGE_BACKWARDS: "pageBackward",
   UPDATE_MAX_ITEMS: "updateMaxItems",
   ITEM_UPDATED: "itemUpdate",
   REORDER: "reorderItems",
   FILTER: "filterItems"
};
export { collectionEvents };

class Collection extends React.Component {

   constructor(props) {
      super(props);

      this.url = props.url || "/api/-default-/public/alfresco/versions/1/people";
      this.filterUrl = props.filterUrl || "/api/-default-/public/alfresco/versions/1/queries/people";

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

      this.navigate = this.navigate.bind(this);
      this.setRelativePath = this.setRelativePath.bind(this);
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

      window.componentHandler.upgradeElement(this.refs.list);
   }

   filterItems(event) {
      if (event && event.detail && event.detail.term && event.detail.term.length > 1)
      {
         this.setState({
            skipCount: 0,
            orderDirection: this.state.orderDirection === "ASC" ? "DESC" : "ASC"
         }, () => {
            let url = `${this.filterUrl}?term=${event.detail.term}&skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection}`;
            axios.get(url)
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

      let url = `${this.url}?skipCount=${this.state.skipCount}&maxItems=${this.state.maxItems}&orderBy=${this.state.orderBy} ${this.state.orderDirection}`;
      axios.get(url)
         .then(response => {
            this.setState({list: response.data.list});
         });
   }

   navigate(item) {
      if (item.entry.isFolder)
      {
         this.setState({
            skipCount: 0,
            relativePath: `${this.state.relativePath}${item.entry.name}/`
         }, () => {
            this.getData();
         });
      }
   }

   setRelativePath(relativePath) {
      this.setState({
         skipCount: 0,
         relativePath: relativePath
      }, () => {
         this.getData();
      });
   }

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         list: this.state.list,
         orderBy: this.state.orderBy,
         orderDirection: this.state.orderDirection
      }));
      return (
         <div ref="list" >
            {childrenWithProps}
         </div>)
   }
}

export default Collection;