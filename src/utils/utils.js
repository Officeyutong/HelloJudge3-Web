import showdown from "showdown";
import showdownKatex from "showdown-katex";

const converter = new showdown.Converter(
    {
        extensions: [
            showdownKatex(
                {
                    throwOnError: false, // allows katex to fail silently
                    errorColor: '#ff0000',
                    delimiters: [
                        { left: "$$", right: "$$", display: true }, // katex default
                        { left: '$', right: '$', display: false },
                    ],
                }
            )
        ]
    }
);
const getAppName = () => {
    return process.env.REACT_APP_NAME;
}

const renderMarkdown = (text) => {
    return converter.makeHtml(text);
};

export { getAppName, renderMarkdown };