import React from "react";
import axios from "axios";
import qs from "qs";
import MessageBox from "../utils/Modal";
import { Container, Header, Segment, Form, Message, Divider, List, Checkbox, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "nycticorax";
import md5 from "md5";
class ProfileEditPage extends React.Component {
    state = {
        done: false,
        data: null,
        successMessage: "",
        errorMessage: "",
        loading: false,
        password: "",
        password2: "",
        uid: -1
    };
    constructor(props) {
        super(props);
        this.state.uid = props.match.params.uid;
    }
    componentWillReceiveProps(props) {
        document.title = "个人信息编辑 - " + props.base.appName;
    }
    submit() {
        this.setState({
            successMessage: "",
            errorMessage: ""
        });
        if (this.state.password !== "" && this.state.password !== this.state.password2) {
            this.setState({
                errorMessage: "两次密码不一致"
            });
            return;
        }
        let data = this.state.data;
        axios.post("/api/update_profile", qs.stringify({
            uid: this.state.uid,
            data: JSON.stringify({
                banned: data.banned,
                username: data.username,
                email: data.email,
                description: data.description,
                changePassword: this.state.password !== "",
                newPassword: md5(this.state.password + this.props.base.salt),
                permission_group: data.permission_group,
                permissions: data.permissions
            })
        })).then(resp => {
            let data = resp.data;
            if (data.code) {
                this.setState({ errorMessage: data.message });
            } else {
                this.setState({ successMessage: "成功" });
            }
        });
    }
    toggleAdminMode() {
        axios.post("/api/user/toggle_admin_mode").then(resp => {
            let data = resp.data;
            if (data.code) {
                MessageBox.show(data.message);
                return;
            } else {
                window.location.reload();
            }
        });
    }
    componentDidMount() {
        axios.post("/api/get_user_profile", qs.stringify({ uid: this.state.uid })).then(resp => {
            let data = resp.data;
            if (data.code) {
                MessageBox.show(data.message);
                return;
            } else {
                this.setState({
                    data: data.data,
                    done: true
                });
            }
        });
    }
    render() {
        if (!this.state.done) return null;
        let data = this.state.data;
        return <div style={{ top: "10%" }}>
            <Container textAlign="left">
                <Header content={<h1>用户资料编辑</h1>} />
                <Segment stacked>
                    <Form as="div"
                        error={this.state.errorMessage !== ''}
                        success={this.state.successMessage !== ''}
                    >
                        <Form.Input label="用户名"
                            onChange={(evt) => this.setState({ data: { ...data, username: evt.target.value } })}
                            value={data.username}
                        />
                        <Form.Input label="电子邮箱"
                            onChange={(evt) => this.setState({ data: { ...data, email: evt.target.value } })}
                            value={data.email}
                        />
                        <Form.Field label="个人简介"
                            onChange={(evt) => this.setState({ data: { ...data, description: evt.target.value } })}
                            value={data.description}
                            control="textarea"
                        />
                        <Form.Field label="头像" control="div" >
                            请前往:<a href="https://en.gravatar.com/">https://en.gravatar.com/</a>进行更改.
                        </Form.Field>
                        <Form.Field label="Remote Judge 账户管理" control="div">
                            请前往:<Link to="/remote_judge/accounts">这里</Link>进行更改.
                        </Form.Field>
                        <Divider />
                        <Form.Field control={Form.Group} label="更改密码(不需要更改请留空)">
                            <Form.Input label="密码" type="password"
                                onChange={(evt) => this.setState({ password: evt.target.value })}
                                value={this.state.password}
                            />
                            <Form.Input label="重复密码" type="password"
                                onChange={(evt) => this.setState({ password2: evt.target.value })}
                                value={this.state.password2}
                            />
                        </Form.Field>
                        <Divider />
                        <Form.Input label="权限组"
                            onChange={(evt) => this.setState({ data: { ...data, permission_group: evt.target.value } })}
                            value={data.permission_group}
                        />
                        <Form.Field label="组权限列表" control={List}>
                            {data.group_permissions.map((item, i) => <List.Item key={i}>{item}</List.Item>)}
                        </Form.Field>
                        <Form.Field label="用户权限列表" control={List}>
                            {data.permissions.map((item, i) => <List.Item key={i}>{item}</List.Item>)}
                        </Form.Field>
                        {
                            data.managable && (
                                <>
                                    <Divider />
                                    <Form.Field control={Checkbox} toggle label="账户封禁" onChange={() => this.setState({ data: { ...data, banned: !data.banned } })} checked={data.banned} />
                                </>
                            )
                        }
                        <Message success>
                            <Message.Header content="完成" />
                            < p>{this.state.successMessage}</p>
                        </Message>
                        <Message error>
                            <Message.Header content="发生错误" />
                            < p>{this.state.errorMessage}</p>
                        </Message>
                        <Button loading={this.state.loading} onClick={() => this.submit()} color="green" content="提交" />
                        {data.canSetAdmin && this.props.base.uid === data.id && <Button onClick={() => this.toggleAdminMode()} color="green" content={(data.permission_group === "admin" ? "关闭管理员模式" : "打开管理员模式")} />}

                    </Form>
                </Segment>
            </Container>
        </div>
    }
};

export default connect("base")(ProfileEditPage);
