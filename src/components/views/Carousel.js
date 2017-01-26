import React from "react";

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

   next() {
      let nextLeft = ((parseInt(this.refs.carousel.style.left, 10) / 100) - 1) * 100;
      if (nextLeft > (this.props.list.pagination.maxItems -1) * -100)
      {
         this.refs.carousel.style.left = nextLeft + "%";
      }
   }

   previous() {
      let nextLeft = ((parseInt(this.refs.carousel.style.left, 10) / 100) + 1) * 100;
      if (nextLeft <= 0)
      {
         this.refs.carousel.style.left = nextLeft + "%";
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
         <div>
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