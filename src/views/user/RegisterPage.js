import React from "react";
import { connect } from "nycticorax";
import { Container, Header, Segment, Dimmer, Loader, Form, Button, Message } from "semantic-ui-react";
// import { Link } from "react-router-dom";
import qs from 'qs';
import axios from "axios";
import md5 from "md5";
class LoginPage extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        password2: "",

        errorMessage: "",
    };
    componentWillReceiveProps(props) {
        document.title = "注册 - " + props.base.appName;
    }
    register() {
        console.log("Register...");
        this.setState({
            errorMessage: "",
        });
        if (this.state.username === "" || this.state.password === "" || this.state.email === "") {
            this.setState({
                errorMessage: "请输入用户名或密码或邮箱"
            });
            return;
        }
        if (this.state.password !== this.state.password2) {
            this.setState({
                errorMessage: "两次密码不一致"
            });
            return;
        }
        axios.post("/api/register", qs.stringify({
            username: this.state.username,
            // identifier: this.state.identifier,
            password: md5(this.state.password + this.props.base.salt),
            email: this.state.email
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

    render() {
        return (
            <Container textAlign="left" >
                <Header>
                    <h1>注册</h1>
                </Header>
                <Segment stacked style={{
                    maxWidth: 500
                }}>
                    <Dimmer active={this.state.loading}>
                        <Loader></Loader>
                    </Dimmer>
                    <Form as="div"
                        error={this.state.errorMessage !== ''}
                    >
                        <Form.Field >
                            <label>用户名</label>
                            <input onChange={(evt) => this.setState({ username: evt.target.value })} value={this.state.username} />
                        </Form.Field>
                        <Form.Field >
                            <label>邮箱</label>
                            <input onChange={(evt) => this.setState({ email: evt.target.value })} value={this.state.email} />
                        </Form.Field>
                        <Form.Group>
                            <Form.Input label="密码" type="password" onChange={(evt) => this.setState({ password: evt.target.value })} value={this.state.password} />
                            <Form.Input label="重复密码" type="password" onChange={(evt) => this.setState({ password2: evt.target.value })} value={this.state.password2} />

                        </Form.Group>

                        <Message error header="错误" content={this.state.errorMessage} />
                        <Button onClick={() => this.register()} color="green">提交</Button>

                    </Form>
                </Segment>
            </Container>
        );
    }
};

export default connect("base")(LoginPage);