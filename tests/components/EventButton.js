import React from "react";

export default class EventButton extends React.Component {

   emitEvent() {
      let changeEvent = new CustomEvent(this.props.eventName, {
         detail: this.props.eventDetail,
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   render() {
      return (<button ref="componentNode" onClick={() => this.emitEvent()}>Test</button>);
   }
}