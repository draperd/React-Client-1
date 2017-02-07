import React from "react";
import { collectionEvents } from "../containers/Collection";

class Filter extends React.Component {

   componentDidMount() {
      if (this.props.focus)
      {
         this.refs.filterField.focus();
      }
   }

   onChange(event) {
      var changeEvent = new CustomEvent(collectionEvents.FILTER, {
         detail: {
            term: event.target.value
         },
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      return (
         <div ref="componentNode"
              className="mdl-textfield mdl-js-textfield">
            <input ref="filterField"
                   className="mdl-textfield__input" 
                   type="text" 
                   id="filter" 
                   onChange={this.onChange.bind(this)}/>
            <label className="mdl-textfield__label" htmlFor="filter">Search...</label>
         </div>
      );
   }
}

export default Filter;