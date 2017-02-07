import React from "react";
import { collectionEvents } from "../containers/Collection";

/**
 * Example of a "Higher Order Component" pattern in React. A function that takes a component, wraps it and provides
 * augmented functionality without directly extending the class or mutating the prototype of the original - a pure
 * function with no side-effects.
 * 
 * This function provides trivial "debouncing" of the Filter input to avoid spamming requests on each key press.
 */
function DebouncedFilter(Filter, debounceWait) {
    return class extends React.Component {
        componentDidMount() {
            this.refs.componentNode.addEventListener(collectionEvents.FILTER, this.debounce.bind(this));
        }

        componentWillUnmount() {
            this.refs.componentNode.removeEventListener(collectionEvents.FILTER, this.debounce);
        }

        debounce(event) {
            if (this.interval)
            {
                clearTimeout(this.interval);
            }
            // debounce via a timeout
            this.interval = setTimeout(
                this.fireEvent.bind(this, event.detail.term),
                debounceWait || 250
            );
            // kill the original event
            event.stopPropagation();
            event.preventDefault();
        }

        fireEvent(term) {
            // refire our new custom event with the original event term
            var changeEvent = new CustomEvent(collectionEvents.FILTER, {
                detail: {term},
                bubbles: true
            });
            // note we fire the event off an outer element to avoid recatching the same event again!
            this.refs.outerNode.dispatchEvent(changeEvent);
        }
        
        render() {
            return <div ref="outerNode"><div ref="componentNode"><Filter {...this.props} /></div></div>
        }
    }
}

export default DebouncedFilter;