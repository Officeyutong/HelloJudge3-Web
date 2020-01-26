import React from "react";

export default function ({ score, fullScore }) {
    const getTextColor = ratio => {
        ratio *= 100;
        if (ratio <= 50) return "red";
        else if (ratio <= 70) return "orange";
        else if (ratio < 100) return "darkorange";
        else return "green";
    };

    return <span style={{
        fontWeight: "bold",
        color: getTextColor(score / fullScore)
    }}>
        {score} / {fullScore}
    </span>
};