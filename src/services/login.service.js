import axios from "axios";
import { baseUrl } from '../environment.dev';

export function loginAPICall(loginModel) {
    const url = baseUrl + 'token/login';
    return axios.post(url, loginModel);
}
