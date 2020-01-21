import React from 'react';
import { Route } from "react-router-dom";
import HomePage from "../views/HomePage";
function router() {
    return (
        <Route path="/" exact component={HomePage} />
    );
}

export default router;