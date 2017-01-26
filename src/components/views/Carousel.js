import React from "react";
import { collectionEvents } from "../containers/Collection";

const CarouselStyle = {
   frame: {
      overflow: "hidden"
   },
   carousel: {
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
      position: "relative",
      left: "0%"
   },
   carouselSeat: {
      flex: "1 0 100%"
   }
};

class Carousel extends React.Component {

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

   next() {
      let nextLeft = ((parseInt(this.refs.carousel.style.left, 10) / 100) - 1) * 100;
      if (nextLeft > (this.props.list.pagination.count) * -100)
      {
         this.refs.carousel.style.left = nextLeft + "%";
      }
      else if (this.props.list.pagination.hasMoreItems)
      {
         this.pageForward();
         this.refs.carousel.style.left = "0%";
      }
   }

   previous() {
      let nextLeft = ((parseInt(this.refs.carousel.style.left, 10) / 100) + 1) * 100;
      if (nextLeft <= 0)
      {
         this.refs.carousel.style.left = nextLeft + "%";
      }
      else if (this.props.list.pagination.skipCount)
      {
         this.pageBack();
         this.refs.carousel.style.left = ((this.props.list.pagination.maxItems -1) * -100) + "%" ;
      }
   }

   render() {
      let body = this.props.list.entries.map((entry) => {
         const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            item: entry
         }));
         return (
            <li style={CarouselStyle.carouselSeat} key={entry.entry.id}>
               {childrenWithProps}
            </li>
         );
      });

      return ( 
         <div ref="componentNode">
            <div style={CarouselStyle.frame}>
               <ul ref="carousel" style={CarouselStyle.carousel}>
                  {body}
               </ul>
            </div>
            <button className="mdl-button mdl-js-button mdl-button--icon"
                 onClick={this.previous.bind(this)}>
               <i className="material-icons">chevron_left</i>
            </button>
            <button className="mdl-button mdl-js-button mdl-button--icon"
                 onClick={this.next.bind(this)}>
               <i className="material-icons">chevron_right</i>
            </button>
         </div>
      );
   }
}

export default Carousel;