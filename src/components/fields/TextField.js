import React from "react";

class TextField extends React.Component {

   render() {
      return (
         <div className="mdl-textfield mdl-js-textfield">
            <input id={this.props.id}
                   name={this.props.name}
                   className="mdl-textfield__input" 
                   type={this.props.type || "text"} 
                   value={this.props.value}
                   onChange={this.props.onChange} />
           <label className="mdl-textfield__label" 
                   htmlFor={this.props.id}>{this.props.label}</label>
         </div>
      )
   }
}

export default TextField;