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
      left: "0%",
      transition: "left .5s cubic-bezier(0, 1, .75, 1.01)"
   },
   carouselSeat: {
      flex: "1 0 100%"
   }
};

class Carousel extends React.Component {

   constructor(props) {
      super(props);
      this.showLast = false;
   }

   componentDidMount() {
      this.refs.componentNode.addEventListener(collectionEvents.ITEM_CREATED, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.ITEM_UPDATED, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.UPDATE_MAX_ITEMS, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.REORDER, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.FILTER, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.NAVIGATE, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.RELATIVE_PATH, this.resetCarousel.bind(this));
   }

   resetCarousel() {
      this.showLast = false;
   }

   componentDidUpdate() {
      if (!this.showLast)
      {
         this.refs.carousel.style.left = "0%";
      }
      else
      {
         this.refs.carousel.style.left = ((this.props.list.pagination.count -1) * -100) + "%" ;
      }
   }

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
         this.showLast = false;
         this.pageForward();
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
         this.showLast = true;
         this.pageBack();
      }
   }

   render() {
      let body = this.props.list.entries.map((entry) => {
         const childrenWithProps = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
               item: entry
            })
         });
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