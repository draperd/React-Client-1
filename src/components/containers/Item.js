import React from "react";
import xhr from "../../utilities/Xhr";

const itemEvents = {
   
};
export { itemEvents };

class Item extends React.Component {

   constructor(props) {
      super(props);
      this.url = props.url || `/api/-default-/public/alfresco/versions/1/nodes/`;
      this.state = {
         item: {
            entry: {}
         }
      };
   }

   componentWillMount() {
      this.getData();
   }

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

   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         item: this.state.item
      }));
      return (
         <div>
            {childrenWithProps}
         </div>);
   }
}

Item.contextTypes = {
    router: React.PropTypes.object
};


export default Item;