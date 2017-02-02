/**
 * @module
 */
import React from "react";
import { collectionEvents } from "../containers/Collection";
import "./css/Carousel.css";

/**
 * @class
 */
class Carousel extends React.Component {

   /**
    * @constructor
    * @param {object} props
    * @param {string} [props.frameHeight="auto"] The height of the frame containing the carousel
    * @param {string} [props.frameWidth="auto"] The width of the frame that shows each item in the carousel
    */
   constructor(props) {
      super(props);
      this.showLast = false;

      this.style = {
         frame: {
            width: props.frameWidth || "auto"
         },
         container: {
            height: props.frameHeight || "auto"
         }
      };
   }

   /**
    * 
    * @instance
    */
   componentDidMount() {
      this.refs.componentNode.addEventListener(collectionEvents.ITEM_CREATED, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.ITEM_UPDATED, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.UPDATE_MAX_ITEMS, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.REORDER, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.FILTER, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.NAVIGATE, this.resetCarousel.bind(this));
      this.refs.componentNode.addEventListener(collectionEvents.RELATIVE_PATH, this.resetCarousel.bind(this));
   }

   /**
    * 
    * @instance
    */
   resetCarousel() {
      this.showLast = false;
   }

   /**
    * 
    * @instance
    */
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

   /**
    * 
    * @instance
    */
   pageBack() {
      let changeEvent = new CustomEvent(collectionEvents.PAGE_BACKWARDS, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   /**
    * 
    * @instance
    */
   pageForward() {
      let changeEvent = new CustomEvent(collectionEvents.PAGE_FORWARDS, {
         bubbles: true
      });
      this.refs.componentNode.dispatchEvent(changeEvent);
   }

   /**
    * 
    * @instance
    */
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

   /**
    * 
    * @instance
    */
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

   /**
    * 
    * @instance
    */
   render() {
      let body = this.props.list.entries.map((entry) => {
         const childrenWithProps = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
               item: entry
            })
         });
         return (
            <li className="components_views_Carousel__item" key={entry.entry.id}>
               {childrenWithProps}
            </li>
         );
      });

      return ( 
         <div className="components_views_Carousel" ref="componentNode">
            <div className="components_views_Carousel__frame" style={this.style.frame}>
               <ul className="components_views_Carousel__container" ref="carousel" style={this.style.container}>
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