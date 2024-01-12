import axios from 'axios';
import { getCookie, setCookie } from 'typescript-cookie'

export function setToken(token:string) {
    setCookie("token", token, {expires: 7})
    axios.defaults.headers.common["Authorization"] = token;
}

export function getTokenIfExists() {
    const cookieToken = getCookie("token");
    if (cookieToken) {
        axios.defaults.headers.common["Authorization"] = cookieToken;

    }
}

