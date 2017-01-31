/**
 * @module
 */
import React from "react";
import xhr from "../../utilities/Xhr";

/**
 * The names of the {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent|Custom Events} that
 * are listened to by the [Item component]{@link module:components/containers/Item~Item}.
 * 
 * @static
 * @type {object}
 * @property {string} REFRESH_ITEM Indicates that the item data should be reloaded
 */
const itemEvents = {
   REFRESH_ITEM: "refreshItem"
};
export { itemEvents };

/**
 *
 * @class
 */
class Item extends React.Component {

   /**
    * 
    * @constructor
    * @param {object} props
    * @param {string} [url=/api/-default-/public/alfresco/versions/1/nodes/"] The base URL to retrieve the item (please
    * note that an id will automatically be appended to this URL)
    */
   constructor(props) {
      super(props);
      this.url = props.url || "/api/-default-/public/alfresco/versions/1/nodes/";
      this.state = {
         item: {
            entry: {}
         }
      };
   }

   /**
    * Calls [getData]{@link module:components/containers/Item~Item#getData} to get the initial item data.
    * 
    * @instance
    */
   componentWillMount() {
      this.getData();
   }

   /**
    * Sets up all the event listeners required to trigger state updates. Each of the properties in 
    * the [itemEvents]{@link module:components/containers/Item.itemEvents} object
    * will have a listener created for it.
    * 
    * @instance
    */
   componentDidMount() {
      this.refs.componentNode.addEventListener(itemEvents.REFRESH_ITEM, this.getData.bind(this));
   }

   /**
    * Makes an XHR request using the configured url property.
    * 
    * @instance
    */
   getData() {
      let id = this.props.id || this.context.router.params.id;
      if (id)
      {
         let url = `${this.url}${id}`;
         xhr.get(url)
            .then(response => {
               this.setState({item: response.data});
            });
      }
   }

   /**
    * @instance
    * @return {JSX}
    */
   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         item: this.state.item
      }));
      return (
         <div ref="componentNode">
            {childrenWithProps}
         </div>);
   }
}

Item.contextTypes = {
    router: React.PropTypes.object
};


export default Item;