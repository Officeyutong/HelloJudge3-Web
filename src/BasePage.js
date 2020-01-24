import React from "react";
import { Menu, Container, Button, Sidebar, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import MainRouter from "./routes/Router";
import { createStore, connect } from "nycticorax";
import { getAppName } from "./utils/utils";
import axios from "axios";
import UserProfileImage from "./views/utils/UserProfilePhoto";
createStore({
    base: {
        uid: -1,
        username: "",
        isLogin: false,
        managable: false,
        salt: "",
        appName: "",
        judgeStatus: {

        },
        setTitle: null

    }
})
class BasePage extends React.Component {
    state = {
        showingSidebar: false,
        showDiscussionLinks: false,
    };
    logout() {
        axios.post("/post/logout").then(resp => {
            window.location.reload();
        });
    }
    componentDidMount() {
        axios.post("/api/this_should_be_the_first_request").then(resp => {
            let data = resp.data;
            
            if (data.result) {
                this.props.dispatch({
                    base: {
                        ...this.props.base,
                        uid: data.uid,
                        username: data.username,
                        isLogin: true,
                        managable: data.backend_managable,
                        email: data.email,
                        salt: data.salt,
                        judgeStatus: data.judgeStatus,
                        appName: data.appName,
                    }
                });
            } else {
                this.props.dispatch({
                    base: {
                        ...this.props.base,
                        salt: data.salt,
                        judgeStatus: data.judgeStatus,
                        appName: data.appName,
                    }
                })
            }
            console.log("dispatched..");
        });
    }
    render() {
        return (
            <Router>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        vertical
                        visible={this.state.showingSidebar}
                    >
                        <Menu.Item as={Link} to="/" >
                            <Icon name="home"></Icon>
                            主页
                        </Menu.Item>
                        <Menu.Item as={Link} to="/problems/1" >
                            <Icon name="tasks"></Icon>
                            题库
                        </Menu.Item>
                        <Menu.Item as={Link} to="/submissions/1" >
                            <Icon name="hdd"></Icon>
                            提交
                        </Menu.Item>
                        <Menu.Item as={Link} to="/team" >
                            <Icon name="address book"></Icon>
                            团队
                        </Menu.Item>
                        <Menu.Item as={Link} to="/problemset/list/1" >
                            <Icon name="book"></Icon>
                            习题集
                        </Menu.Item>
                        <Menu.Item as={Link} to="/contests/1" >
                            <Icon name="chart line"></Icon>
                            比赛
                        </Menu.Item>
                        <Menu.Item as="div" onClick={() => this.setState({ showDiscussionLinks: !this.state.showDiscussionLinks })}>
                            <Icon name="keyboard outline"></Icon>
                            讨论
                        </Menu.Item>
                        {
                            this.state.showDiscussionLinks && <>
                                <Menu.Item as={Link} to="/discussions/discussion.global/1">
                                    全局讨论
                                </Menu.Item>
                                <Menu.Item as={Link} to="/discussions/discussion.problem.global/1">
                                    题目全局讨论
                                </Menu.Item>

                            </>
                        }
                        <Menu.Item as={Link} to="/ranklist/1" >
                            <Icon name="signal"></Icon>
                            排行榜
                        </Menu.Item>
                        {
                            (() => {
                                if (this.props.base.isLogin) {
                                    return <>
                                        <Menu.Item as={Link} to="/ide" >
                                            <Icon name="code"></Icon>
                                            在线IDE
                                        </Menu.Item>
                                        <Menu.Item as={Link} to="/help">
                                            <Icon name="help circle"></Icon>
                                            帮助
                                        </Menu.Item>
                                        <Menu.Item as={Link} to={"/profile_edit/" + this.props.base.uid}>
                                            <Icon name="address card"></Icon>
                                            个人信息编辑
                                        </Menu.Item>
                                        {this.props.base.managable && <Menu.Item as={Link} to="/admin" >
                                            <Icon name="sitemap"></Icon>后台管理
                                            </Menu.Item>}
                                        {
                                            this.props.base.isLogin && <Menu.Item as={Link} to={"/profile/" + this.props.base.uid}>
                                                <UserProfileImage email={this.props.base.email} />
                                                <span>{this.props.base.username}</span>
                                            </Menu.Item>
                                        }
                                        <Menu.Item as="a" onClick={this.logout}>
                                            <Icon name="x"></Icon>
                                            登出
                                        </Menu.Item>
                                    </>

                                } else {
                                    return <>
                                        <Menu.Item as={Link} to="/login">
                                            请登录..
                                    </Menu.Item>
                                        <Menu.Item as={Link} to="/register">
                                            或者注册
                                    </Menu.Item>

                                    </>;
                                }
                            })()
                        }

                    </Sidebar>

                    <Sidebar.Pusher dimmed={this.state.showingSidebar} onClick={() => this.state.showingSidebar && this.setState({ showingSidebar: false })} style={{
                        height: "100%",
                        width: "100%"
                    }}>
                        <div style={{
                            marginTop: "50px",
                            marginLeft: "50px",
                            top: "50px",
                            position: "fixed"
                        }}>
                            <Button className="floating" circular size="huge" color="green" icon="plus" onClick={
                                () => this.setState({
                                    showingSidebar: !this.state.showingSidebar
                                })
                            }>
                            </Button>
                        </div>
                        <Container style={{
                            marginTop: "70px",
                            marginBottom: "70px"
                        }}>
                            {/* <Route path="/" component={HomePage}></Route> */}
                            <MainRouter></MainRouter>
                            <Container className="center aligned" style={{ paddingTop: "20px" }} >
                                <div style={{ color: "darkgrey" }}>
                                    {getAppName()} Powered by <a href="https://gitee.com/yutong_java/HelloJudge2"> HelloJudge2 </a>
                                </div>
                            </Container>
                        </Container>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>

            </Router>
        );
    }
};
export default connect("base")(BasePage);