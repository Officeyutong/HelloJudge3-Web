import React, { useState, useEffect } from "react";
import MessageBox from "../utils/Modal";
import ACE from "react-ace";
import { connect } from "nycticorax";
import { ProblemMeta } from "./ProblemBase";
function ShowProblemPage({ base, match, history }) {
    let isContest = match.params.contestID ? true : false;
    let [loaded, setLoaded] = useState(false);
    let [data, setData] = useState({});
    useEffect(() => {
        if (!loaded) {
            setLoaded(true);

        }
    });
}

export default connect("base")(ShowProblemPage);