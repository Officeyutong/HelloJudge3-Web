import React from "react";
import { connect } from "nycticorax";
import { Label, Icon } from "semantic-ui-react";
function JudgeStatusLabel({ base, status }) {
    const getIcon = (name) => {
        if (Object.keys(base.judgeStatus).length === 0) return "";
        return base.judgeStatus[status].icon.replace(" icon", "");
    };
    const getColor = (name) => {
        if (Object.keys(base.judgeStatus).length === 0) return "black";
        return base.judgeStatus[status].color;
    };
    const getText = (name) => {
        if (Object.keys(base.judgeStatus).length === 0) return name;
        return base.judgeStatus[status].text;
    };
    // console.log(base.judgeStatus);
    // console.log(getIcon(status));
    return <Label color={getColor(status)}  >
        <Icon name={getIcon(status)}></Icon>
        {getText(status)}
    </Label>
}

export default connect("base")(JudgeStatusLabel);

