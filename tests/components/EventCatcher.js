import React from "react";

export default class EventCatcher extends React.Component {

   constructor(props) {
      super(props);
      this.state = {};
   }

   handleEvent(event) {
      this.setState({
         lastEvent: event
      });
   }

   componentDidMount() {
      this.props.events && this.props.events.forEach(function(event) {
         this.refs.componentNode.addEventListener(event, this.handleEvent.bind(this));
      }, this);
   }

   render() {
      return (
         <div ref="componentNode">
            {this.props.children}
         </div>
      );
   }
}