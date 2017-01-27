import axios from "axios";
import auth from "./Authentication";
import { browserHistory } from "react-router";

export default {

   onError(error) {
      console.log("Caught error", error);
      if (error.response.status === 401)
      {
         auth.logout();
         browserHistory.push("/login");
      }
   },

   get(url) {
         return axios.get(url, auth.getAxiosConfig()).catch(error => this.onError(error));         
   },

   put(url, data) {
      return axios.put(url, data, auth.getAxiosConfig()).catch(response => this.onError(response));
   },

   post(url, data) {
      return axios.post(url, data, auth.getAxiosConfig()).catch(response => this.onError(response));
   },

   delete(url) {
      return axios.delete(url, auth.getAxiosConfig()).catch(response => this.onError(response));
   }
};
