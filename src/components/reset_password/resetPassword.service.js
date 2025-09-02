import axios from "axios";
import { baseUrl } from "../../environment/environment.dev";

export function resetPasswordAPICall(payload) {
  // Your backend endpoint for resetting the password
  const url = baseUrl + "api/account/reset-password";
  
  // Using PUT method as defined in your backend
  return axios.put(url, payload);
}