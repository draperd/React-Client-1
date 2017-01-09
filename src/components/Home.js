import React from "react";
import NodeService from "alfresco-js-utils/lib/services/NodeService";
import auth from "alfresco-js-utils/lib/Authentication";

const Home = React.createClass({

   componentWillMount() {

      this.state = {
         list: {
            entries: []
         }
      };

      const options = {
         skipCount: 0,
         maxItems: 3,
         relativePath: '/'
      };

      NodeService.getItems(options)
         .then(response => {
            this.setState({list: response.data.list});
         });
   },
   
   render() {
    const token = auth.getTicket()

    return (
      <div>
        <ul> {this.state.list.entries.map((entry) => 
           <li>{entry.entry.name}</li>
        )} </ul>
      </div>
    )
  }
})

export default Home;