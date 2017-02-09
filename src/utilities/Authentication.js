import axios from "axios";

export default {

   login(userId, password) {
      return new Promise((resolve) => {
         if (localStorage.ticket) {
            // The user is already authenticated so nothing more is required...
            this.onChange(true);
            resolve(true);
         }
         else
         {
            // There is no session ticket in local storage so we need to make an XHR
            // request to get one...
            axios.post("/api/-default-/public/authentication/versions/1/tickets", {
               userId: userId,
               password: password
            }).then(response => {
               if (response.status === 201)
               {
                  // Authentication was successful so save the ticket in local storage
                  // and call onChange with an argument of true to indicate that authentication
                  // has been successful...
                  localStorage.ticket = response.data.entry.id;
                  this.onChange(true);
                  resolve(true);
               }
               else
               {
                  // If authentication failed for any reason call onChange with an argument
                  // of false to indicate that login has failed...
                  this.onChange(false);
                  resolve(false);
               }
            })
            .catch(() => {
               this.onChange(false);
               resolve(false);
            });
         }
      });
   },

   getTicket() {
      return localStorage.ticket;
   },

   logout() {
      return new Promise((resolve) => {
         delete localStorage.ticket;

         axios.delete("/api/-default-/public/authentication/versions/1/tickets/-me-", this.getAxiosConfig())
            .then(response => {
               this.onChange(false);
               resolve(true);
            });
      });
   },

   loggedIn() {
      return !!localStorage.ticket;
   },

   getAxiosConfig() {
      return {
         headers: { authorization: "Basic " + btoa(localStorage.ticket) }
      };
   },

   onChange() {}
};
