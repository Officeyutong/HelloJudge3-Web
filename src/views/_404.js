import React from "react";


import { Message, Header, Button } from "semantic-ui-react";

export default class _404 extends React.Component {
    render() {
        return <>
            <Message error>
                <Header>
                    <h1>嘿,你404了!</h1>
                </Header>
                <Message.Content>
                    <p>这个页面不存在...</p>
                    <Button color="green" onClick={() => this.props.history.goBack()}>返回..</Button>

                </Message.Content>
            </Message>
        </>;
    }
};