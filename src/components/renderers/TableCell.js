/**
 * @module
 */
import React from "react";
import Renderer from "./Renderer";

/**
 * <p>Renders a cell within a [TableView]{@link module:components/views/TableView~TableView} and is expected
 * to be a child component of either [TableViewBody]{@link module:components/views/TableViewBody~TableViewBody}
 * or [TableViewFoot]{@link module:components/views/TableViewFoot~TableViewFoot}. If a "property" is provided
 * as an attribute then that will be rendered but when a "property" attribute is not provided then a cell
 * will be rendered containing any child components provided.</p>
 * <p>The rendering capabilities are inherited from the [Renderer]{@link module:components/renderers/Renderer~Renderer}
 * class that this extends.</p>
 *
 * @example <caption>Renders a cell containing a thumbnail of the current item</caption>
 * <TableView>
 *    <TableViewBody>
 *        <TableCell>
 *           <Thumbnail></Thumbnail>
 *        </TableCell>
 *     </TableViewBody>
 *  </TableView>
 *
 * @example <caption>Renders the "name" property of the current item</caption>
 * <TableView>
 *    <TableViewBody>
 *        <TableCell property="name" />
 *     </TableViewBody> 
 *  </TableView>
 * 
 * @class
 */
class TableCell extends Renderer {

   /**
    * 
    * @constructor
    * @param  {object} props
    * @param  {string} [props.property] The property of the current item to render in the cell
    * @param  {number} [props.colspan=1] The number of columns that the cell should span
    */
   constructor(props) {
      super(props);
      this.property = props.property;
      this.colspan = props.colspan || 1;
   }

   /**
    * 
    * @instance
    * @return {JSX}
    */
   render() {
      if (this.props.property)
      {
         let renderedProperty = this.getPropertyStringValue({
            item: this.props.item.entry,
            property: this.property
         });

         renderedProperty = this.processPropertyValue({
            value: renderedProperty,
            renderAs: this.props.renderAs
         });

         return (
            <td ref="componentNode" 
                colSpan={this.colspan} 
                className="mdl-data-table__cell--non-numeric"
                onClick={ this.props.navigation ? this.navigate.bind(this) : "" }
                onDoubleClick={ this.props.view ? this.view.bind(this) : "" }
                >{renderedProperty}</td>
         );
      }
      else
      {
         const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            item: this.props.item,
            list: this.props.list
         }));
         return (
            <td ref="componentNode" 
                colSpan={this.colspan} 
                className="mdl-data-table__cell--non-numeric">{childrenWithProps}</td>
         );
      }
   }
}

TableCell.contextTypes = {
    router: React.PropTypes.object
};

export default TableCell;