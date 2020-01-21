import React from "react";
import ReactDOM from "react-dom";
import { Modal, Header, Message, Button } from "semantic-ui-react";
class MyMessageBox extends React.Component {
    state = {
        showing: false,
        message: "",
        title: "标题",
        error: true
    }
    show(message, error = true, title = "标题") {
        this.setState({
            showing: true,
            message: message,
            title: title,
            error: error
        })
    }
    render() {
        return (<Modal
            open={this.state.showing}
            size="tiny"
            closeOnDimmerClick={true}
            closeOnDocumentClick={true}
            // onClick={() => this.setState({ showing: false })}
        >
            <Header content="发生错误" />
            <Modal.Content>
                <Message error={this.state.error}>
                    <Header>
                        <h3>{this.state.message}</h3>
                    </Header>
                    <p>{this.state.message}</p>
                </Message>
            </Modal.Content>
            <Modal.Actions>
                <Button as="a" color="blue" href="/">返回主页</Button>
                <Button color="green" onClick={() => this.setState({ showing: false })}>关闭</Button>
            </Modal.Actions>
        </Modal>);
    }
};

let target = document.createElement("div");

let box = ReactDOM.render(<MyMessageBox />, target);

export default box;
