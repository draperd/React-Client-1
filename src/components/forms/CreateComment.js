import React from "react";
import TextField from "../fields/TextField";

class CreateComment extends React.Component {
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      this.props.data[event.target.name] = event.target.value;
      this.props.onChange(this.props.data);
   }

   render() {
      return (
         <form autoComplete="nope" onSubmit={this.handleSubmit}>
            <TextField id="new_comment_content"
                       name="content"
                       value={this.props.data.content}
                       onChange={this.handleChange} 
                       label="Comment"/>
         </form>
      );
   }
}

export default CreateComment;