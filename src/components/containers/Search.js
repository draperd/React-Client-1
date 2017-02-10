/**
 * @module
 */
import React from "react";
import Collection from "./Collection";
import xhr from "../../utilities/Xhr";

/**
 * The names of the {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent|Custom Events} that
 * are listened to by the [Item component]{@link module:components/containers/Item~Item}.
 * 
 * @static
 * @type {object}
 * @property {string} REFRESH_ITEM Indicates that the item data should be reloaded
 */
const searchEvents = {
   
};
export { searchEvents };

/**
 *
 * @class
 */
class Search extends Collection {

   /**
    * 
    * @constructor
    * @param {object} props
    * @param {string} [url="/api/-default-/public/search/versions/1/search/"] The base URL to retrieve the item (please
    * note that an id will automatically be appended to this URL)
    */
   constructor(props) {
      super(props);
      this.url = props.url || "/api/-default-/public/search/versions/1/search";
      this.state.query = "";
   }

   /**
    * 
    * @instance
    */
   componentWillMount() {
      this.getData();
   }

   filterItems(event) {
      if (event && event.detail && event.detail.term && event.detail.term.length > 1)
      {
         this.setState({
            query: event.detail.term
         }, () => {
            this.getData();
         });
      }
   }

   /**
    * Makes an XHR request using the configured url property.
    * 
    * @instance
    */
   getData() {
      if (this.state.query)
      {
         xhr.post(this.url, {
            query: {
               query: this.state.query
            },
            paging: {
               maxItems: this.state.maxItems,
               skipCount: this.state.skipCount
            },
            // sort: [
            //    {
            //       type: "FIELD",
            //       field: this.state.orderBy,
            //       ascending: this.state.orderDirection === "ASC" ? "true" : "false"
            //    }
            // ],
            filterQueries: [
               { "query": "cm:creator:admin"},
               { "query": "content.size:[0 TO 10240]"}
            ],
            facetQueries: [
               { query: "content.size:[0 TO 10240]", "label": "xtra small"},
               { query: "content.size:[10240 TO 102400]", "label": "small"},
               { query: "content.size:[102400 TO 1048576]", "label": "medium"},
               { query: "content.size:[1048576 TO 16777216]", "label": "large"},
               { query: "content.size:[16777216 TO 134217728]", "label": "xtra large"},
               { query: "content.size:[134217728 TO MAX]", "label": "XX large"}
            ],
            facetFields: {
               facets: [
                  { field: "cm:creator"},
                  { field: "'content.size'" }
               ]
            }
         })
            .then(response => {
               this.setState({
                  list: response.data.list
               });
            });
         }
   }
}

Search.contextTypes = {
    router: React.PropTypes.object
};


export default Search;