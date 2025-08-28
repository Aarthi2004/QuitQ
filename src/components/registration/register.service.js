import axios from "axios";
import { baseUrl } from "../../environment/environment.dev";

export function registerAPICall(registerModel) {
  const url = baseUrl + "api/users/register"; // Adjust if your API path differs
  return axios.post(url, registerModel);
}
