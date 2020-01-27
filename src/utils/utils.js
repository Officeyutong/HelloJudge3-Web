import showdown from "showdown";
import katex from "katex";
const converter = new showdown.Converter(
    {
        extensions: [
            {
                type: 'output', regex: /\$\$([\S\s]+?)\$\$/g, replace: (x, y) => {
                    let result = katex.renderToString(y, {
                        throwOnError: false,
                        displayMode: true
                    });
                    return result;
                }
            },
            {
                type: 'output', regex: /\$([\S\s]+?)\$/g, replace: (x, y) => {
                    let result = katex.renderToString(y, {
                        throwOnError: false,
                        displayMode: false
                    });
                    return result;
                }
            }
        ], tables: true, literalMidWordUnderscores: true
    }
);
const getAppName = () => {
    return process.env.REACT_APP_NAME;
}

const renderMarkdown = (text) => {
    return converter.makeHtml(text);
};
const copyText = text => {
    const element = document.createElement("textarea");
    document.body.appendChild(element);
    element.value = text;
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
};
export { getAppName, renderMarkdown, copyText };