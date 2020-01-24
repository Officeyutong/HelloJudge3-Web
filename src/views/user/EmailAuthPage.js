import React from "react";
import { connect } from "nycticorax";
import { Container, Header, Segment, Dimmer, Loader, Form, Button, Message } from "semantic-ui-react";
import qs from 'qs';
import axios from "axios";
class EmailAuthPage extends React.Component {
    state = {
        errorMessage: "",
        successMessage: "",
        loading: false,
        token: "",
        username: ""
    };
    componentWillReceiveProps(props) {
        document.title = "验证邮箱 - " + props.base.appName;
    }
    constructor(props) {
        super(props);
        this.state.token = decodeURIComponent(decodeURIComponent(props.match.params.token));
    }
    submit() {
        this.setState({
            errorMessage: "",
            successMessage: ""
        });
        if (!this.state.username) {
            this.setState({
                errorMessage: "请输入用户名"
            });
            return;
        }
        axios.post("/api/auth_email", qs.stringify({
            username: this.state.username,
            token: this.state.token
        })).then(resp => {
            let data = resp.data;
            if (data.code) {
                this.setState({ errorMessage: data.message });
            } else {
                this.setState({ successMessage: data.message });
                this.props.history.push("/");
            }
        });
    }
    render() {
        return (
            <Container textAlign="left" >
                <Header>
                    <h1>验证邮箱</h1>
                </Header>
                <Segment stacked style={{
                    maxWidth: 500
                }}>
                    <Dimmer active={this.state.loading}>
                        <Loader></Loader>
                    </Dimmer>
                    <Form as="div"
                        error={this.state.errorMessage !== ''}
                        success={this.state.successMessage !== ''}
                    >
                        <Form.Input label="用户名" placeholder="请输入用户名(非邮箱)..."
                            value={this.state.username}
                            onChange={(evt) => this.setState({ username: evt.target.value })}
                        />
                        <Message error header="错误" content={this.state.errorMessage} />
                        <Message success header="成功" content={this.state.successMessage} />
                        <Button onClick={() => this.submit()} color="green">提交</Button>
                    </Form>
                </Segment>
            </Container>
        );
    }
};

export default connect("base")(EmailAuthPage);