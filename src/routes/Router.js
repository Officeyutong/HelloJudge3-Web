import React from 'react';
import { Route, Switch } from "react-router-dom";
import HomePage from "../views/HomePage";
import LoginPage from "../views/user/LoginPage";
import RegisterPage from "../views/user/RegisterPage";
import ProfilePage from "../views/user/ProfilePage";
import ProfileEditPage from "../views/user/ProfileEditPage";
import EmailAuthPage from "../views/user/EmailAuthPage";
import ResetPasswordPage from "../views/user/ResetPasswordPage";
import ProblemsPage from "../views/problem/ProblemsPage";
import ShowProblemPage from "../views/problem/ShowProblem";
import _404 from "../views/_404";
function router() {
    return (
        <>
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/login" exact component={LoginPage} />
                <Route path="/register" exact component={RegisterPage} />
                <Route path="/profile/:uid" exact component={ProfilePage} />
                <Route path="/profile_edit/:uid" exact component={ProfileEditPage} />
                <Route path="/auth_email/:token" exact component={EmailAuthPage} />
                <Route path="/reset_password/:token" exact component={ResetPasswordPage} />
                <Route path="/problems/:page" exact component={ProblemsPage} />
                <Route path="/problems/:page" exact component={ProblemsPage} />
                <Route path="/problems/:page" exact component={ProblemsPage} />
                <Route path="/show_problem/:problemID" exact component={ShowProblemPage} />
                <Route path="/show_problem/:problemID" exact component={ShowProblemPage} />
                <Route path="/contest/:contestID/problem/:problemID" exact component={ShowProblemPage} />
                
                <Route component={_404}></Route>
            </Switch>
        </>
    );
}

export default router;