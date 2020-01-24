import React from "react";
import { connect } from "nycticorax";
import { Container, Header, Segment, Dimmer, Loader, Form, Button, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import qs from 'qs';
import axios from "axios";
import md5 from "md5";
class LoginPage extends React.Component {
    state = {
        identifier: "",
        password: "",
        errorMessage: "",
        successMessage: "",
        loading: false,
    };
    componentWillReceiveProps(props) {
        document.title = "登录 - " + props.base.appName;
    }
    login() {
        console.log("Login...");
        this.setState({
            errorMessage: "",
            successMessage: ""
        });
        axios.post("/api/login", qs.stringify({
            identifier: this.state.identifier,
            password: md5(this.state.password + this.props.base.salt)
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(resp => {
            let data = resp.data;
            // console.log(data);
            if (data.code) {
                this.setState({
                    errorMessage: data.message
                });
            } else {
                this.props.history.push({ pathname: "/" });
                window.location.reload();
            }
        });

    }
    resetPassword() {
        this.setState({
            errorMessage: "",
            successMessage: ""
        });
        if (this.state.identifier === "") {
            this.setState({ errorMessage: "请输入用户名或邮箱" });
            return;
        }
        this.setState({ loading: true });
        axios.post("/api/require_reset_password", qs.stringify({
            identifier: this.state.identifier
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(resp => {
            let data = resp.data;
            this.setState({ loading: false });
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
                    <h1>登录</h1>
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
                        <Form.Field >
                            <label>用户名或邮箱</label>
                            <input onChange={(evt) => this.setState({ identifier: evt.target.value })} value={this.state.identifier} />
                        </Form.Field>
                        <Form.Field >
                            <label>密码</label>
                            <input type="password" onChange={(evt) => this.setState({ password: evt.target.value })} value={this.state.password} />
                        </Form.Field>
                        <Message error header="错误" content={this.state.errorMessage} />
                        <Message success header="成功" content={this.state.successMessage} />
                        <Button onClick={() => this.login()} color="green">提交</Button>
                        <Link to="/register">注册</Link>
                        {// eslint-disable-next-line 
                        }
                        <a onClick={() => this.resetPassword()}>  重置密码</a>
                    </Form>
                </Segment>
            </Container>
        );
    }
};

export default connect("base")(LoginPage);