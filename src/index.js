import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BasePage from "./BasePage";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

ReactDOM.render(<BasePage />, document.getElementById('root'));

