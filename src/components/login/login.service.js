import axios from "axios";
import { baseUrl } from "../../environment/environment.dev";

export function loginAPICall(loginModel) {
  const url = baseUrl + "api/token/login";
  return axios.post(url, loginModel);
}
