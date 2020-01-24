import React from "react";
import { connect } from "nycticorax";
import { Container, Header, Segment, Dimmer, Loader, Form, Button, Message } from "semantic-ui-react";
import qs from 'qs';
import axios from "axios";
import md5 from "md5";
class ResetPasswordPage extends React.Component {
    state = {
        errorMessage: "",
        successMessage: "",
        loading: false,
        token: "",
        identifier: "",
        password: ""
    };
    componentWillReceiveProps(props) {
        document.title = "重置密码 - " + props.base.appName;
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
        if (!this.state.identifier || !this.state.password) {
            this.setState({
                errorMessage: "请输入完整的信息"
            });
            return;
        }
        axios.post("/api/reset_password", qs.stringify({
            // username: this.state.username,
            // token: this.state.token
            identifier: this.state.identifier,
            password: md5(this.state.password + this.props.base.salt),
            reset_token: this.state.token
        })).then(resp => {
            let data = resp.data;
            if (data.code) {
                this.setState({ errorMessage: data.message });
            } else {
                this.setState({ successMessage: data.message });
            }
        });
    }
    render() {
        return (
            <Container textAlign="left" >
                <Header>
                    <h1>重置密码</h1>
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
                        <Form.Input label="用户名或邮箱"
                            value={this.state.identifier}
                            onChange={(evt) => this.setState({ identifier: evt.target.value })}
                        />
                        <Form.Input label="新密码"
                            type="password"
                            value={this.state.password}
                            onChange={(evt) => this.setState({ password: evt.target.value })}
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

export default connect("base")(ResetPasswordPage);