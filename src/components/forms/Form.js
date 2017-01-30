/**
 * @module
 */

import React from "react";

/**
 *
 * @class
 */
class Form extends React.Component {
   
   /**
    * 
    * @constructor
    */
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
   }

   /**
    * 
    * @instance
    * @param  {object} event The event describing the change.
    */
   handleChange(event) {
      this.props.data[event.target.name] = event.target.value;
      this.props.onChange(this.props.data);
   }


   render() {
      const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
         onChange: this.handleChange,
         value: this.props.data[child.props.name], 
         data: this.props.data
      }));
      
      return (
         <form autoComplete="nope" onSubmit={this.handleSubmit}>
            {childrenWithProps}
         </form>
      );
   }
}

export default Form;