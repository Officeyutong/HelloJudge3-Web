import React from 'react';
import { Route, Switch } from "react-router-dom";
import HomePage from "../views/HomePage";
import LoginPage from "../views/user/LoginPage";
import RegisterPage from "../views/user/RegisterPage";

import _404 from "../views/_404";
function router() {
    return (
        <>
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/login" exact component={LoginPage} />
                <Route path="/register" exact component={RegisterPage} />
                
                <Route component={_404}></Route>
            </Switch>
        </>
    );
}

export default router;