import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BasePage from "./BasePage";
import axios from "axios";
import Dialog from "./views/utils/Modal";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;
axios.interceptors.response.use(resp => {

    // console.log(resp);
    return resp;
}, err => {
    console.log(err);
    let resp = err.response;
    console.log(resp);
    if (resp)
        Dialog.show(resp.data, true, resp.status + " " + resp.statusText);
    else
        Dialog.show(String(err));
});
axios.defaults.withCredentials = true;
ReactDOM.render(<BasePage />, document.getElementById('root'));

export {
    BACKEND_BASE_URL
};