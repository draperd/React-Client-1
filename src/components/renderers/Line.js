/**
 * @module
 */
import React from "react";
import Renderer from "./Renderer";

/**
 * <p>Renders a line generally within a [TableView]{@link module:components/views/TableView~TableView}.
 * If a "property" is provided as an attribute then that will be rendered but when a "property" attribute is not provided
 * then a DIV will be rendered containing any child components provided.</p>
 * 
 * <p>The rendering capabilities are inherited from the [Renderer]{@link module:components/renderers/Renderer~Renderer}
 * class that this extends.</p>
 *
 * @example <caption>Renders a line of text within a table cell</caption>
 * <TableView>
 *    <TableViewBody>
 *        <TableCell>
 *           <Line>Some value on it's own line</Line>
 *        </<TableCell>
 *     </TableViewBody>
 *  </TableView>
 *
 * @example <caption>Renders the "name" property of the current item</caption>
 * <TableView>
 *    <TableViewBody>
 *        <Line property="name" label="Name:" />
 *     </TableViewBody> 
 *  </TableView>
 * 
 * @class
 */
class Line extends Renderer {

   /**
    * 
    * @constructor
    * @param  {object} props
    * @param  {string} [props.property] The property of the current item to render in the cell
    * @param  {string} [props.label] Label for the property, rendered first, on the same line
    * @param  {boolean} [props.renderOnEmpty] If true, will render the line even if the property resolves to a falsey value.
    *         Default is to not render the line if no property value is resolved.
    */
   constructor(props) {
      super(props);
      this.property = props.property;
      this.label = props.label;
      this.renderOnEmpty = (props.renderOnEmpty === true);
   }

   /**
    * 
    * @instance
    * @return {JSX}
    */
   render() {
      if (this.props.property)
      {
         let renderedProperty = this.getRenderedProperty();
         return (
            this.renderOnEmpty || renderedProperty ? 
            <div ref="componentNode"
                 style={ this.props.style }
                 className={ this.props.className }
                 onClick={ this.props.navigation ? this.navigate.bind(this) : "" }
                 onDoubleClick={ this.props.view ? this.view.bind(this) : "" }><strong>{this.label || ""}</strong> {renderedProperty}</div>
            : null
         );
      }
      else
      {
         const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            item: this.props.item,
            list: this.props.list
         }));
         return (
            <div ref="componentNode"><strong>{this.label || ""}</strong> {childrenWithProps}</div>
         );
      }
   }
}

Line.contextTypes = {
    router: React.PropTypes.object
};

export default Line;