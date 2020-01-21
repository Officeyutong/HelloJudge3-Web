import React from "react";
import { connect } from "nycticorax";
function HomePage({ base }) {
    return (<div>{JSON.stringify(base)}</div>);
}

export default connect("base")(HomePage);