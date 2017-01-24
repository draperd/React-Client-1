import React from "react";
import { collectionEvents } from "../containers/Collection";

class Pagination extends React.Component {

   pageBack() {
      let changeEvent = new CustomEvent(collectionEvents.PAGE_BACKWARDS, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   pageForward() {
      let changeEvent = new CustomEvent(collectionEvents.PAGE_FORWARDS, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   updateMaxItems(maxItems) {
      let changeEvent = new CustomEvent(collectionEvents.UPDATE_MAX_ITEMS, {
         detail: maxItems,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      return (<div ref="componentNode">
         
         <span>Results per page:</span>

         <span>{this.props.list.pagination.maxItems}</span>

         <button id="paginationItemsPerPage"
                 className="mdl-button mdl-js-button mdl-button--icon" 
                 onClick={this.pageBack.bind(this)}>
            <i className="material-icons">arrow_drop_down</i>
         </button>

         <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
             htmlFor="paginationItemsPerPage">
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(5)}>5</li>
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(10)}>10</li>
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(20)}>20</li>
            <li className="mdl-menu__item" onClick={() => this.updateMaxItems(50)}>50</li>
         </ul>

         <span>{this.props.list.pagination.skipCount + 1} - {this.props.list.pagination.skipCount + this.props.list.pagination.maxItems} of {this.props.list.pagination.totalItems}</span>

         <button className="mdl-button mdl-js-button mdl-button--icon" 
                 disabled={this.props.list.pagination.skipCount ? false : true} 
                 onClick={this.pageBack.bind(this)}>
            <i className="material-icons">keyboard_arrow_left</i>
         </button>

         <button className="mdl-button mdl-js-button mdl-button--icon" 
                 disabled={this.props.list.pagination.hasMoreItems ? false : true} 
                 onClick={this.pageForward.bind(this)}>
            <i className="material-icons">keyboard_arrow_right</i>
         </button>
      </div>)
   }
}

export default Pagination;