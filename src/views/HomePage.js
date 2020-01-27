import React from "react";
import { connect } from "nycticorax";
import axios from "axios";
import { List, Container, Divider, Grid, Segment, Header, Table } from "semantic-ui-react";
import MessageBox from "./utils/Modal";
import { getAppName, renderMarkdown } from "../utils/utils";
import { Link } from "react-router-dom";
// import _ from "lodash";
class HomePage extends React.Component {
    state = {
        data: null,
        done: false,
        hitokoto: {

        }
    };
    source = axios.CancelToken.source();
    componentWillUnmount() {
        this.source.cancel();
    }

    componentDidMount() {
        // this.setState({
        //     base: this.props.base
        // });
        // this.props.base.setTitle("主页");


        axios.post("/api/home_page", { cancelToken: this.source.token }).then(resp => {
            let data = resp.data;
            // console.log(data);
            if (data.code) {
                MessageBox.show(data.message);
                return;
            }
            document.title = "主页 - " + this.props.base.appName;
            this.setState({
                data: data.data,
                done: true
            });
        });
        axios.get("https://v1.hitokoto.cn/", { cancelToken: this.source.token, withCredentials: false }).then(hitokoto => {
            this.setState({ hitokoto: hitokoto.data });
        });
    }
    render() {
        if (this.state.done) {
            return (
                <div>
                    <Container textAlign="left">
                        <h1>{getAppName()}</h1>
                    </Container>
                    <Divider />
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width="11">
                                <Header>
                                    <h2>公告</h2>
                                </Header>
                                <Segment stacked>
                                    <Table basic="very" celled>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>标题</Table.HeaderCell>
                                                <Table.HeaderCell>时间</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                this.state.data.broadcasts.map(curr => <Table.Row key={curr.id} style={{ minWidth: "300px" }}>
                                                    <Table.Cell><Link to={"/show_discussion/" + curr.id}>{curr.title}</Link></Table.Cell>
                                                    <Table.Cell>{curr.time}</Table.Cell>
                                                </Table.Row>)
                                            }
                                        </Table.Body>
                                    </Table>
                                    <Container textAlign="right">
                                        <Link to="/discussions/broadcast/1">全部公告</Link>
                                    </Container>
                                </Segment>
                                <Header>
                                    <h2>排名</h2>
                                </Header>
                                <Segment stacked>
                                    <Table basic="very" celled>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell textAlign="center">用户名</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">个人签名</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">Rating</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                this.state.data.ranklist.map(curr => <Table.Row key={curr.id}>
                                                    <Table.Cell textAlign="center"><Link to={"/profile/" + curr.id}>{curr.username}</Link></Table.Cell>
                                                    <Table.Cell textAlign="center" style={{
                                                        maxHeight: "50px",
                                                        overflowY: "hidden",
                                                        overflowX: "hidden",
                                                        maxWidth: "700px"
                                                    }}>
                                                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(curr.description) }} />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center">{curr.rating}</Table.Cell>
                                                </Table.Row>)
                                            }
                                        </Table.Body>
                                    </Table>
                                    <Container textAlign="right">
                                        <Link to="/ranklist/1">查看全部</Link>
                                    </Container>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width="5">
                                <Header>
                                    <h2>Hitokoto</h2>
                                </Header>
                                {this.state.hitokoto && <Segment stacked>
                                    <Container textAlign="center" style={{ fontSize: "15px", minHeight: "50px" }}>{this.state.hitokoto.hitokoto}</Container>
                                    <Container textAlign="right" style={{ textAlign: "right" }}>{this.state.hitokoto.from}</Container>
                                    <Container textAlign="right" style={{ textAlign: "right" }}>
                                        <a href={"https://hitokoto.cn?id=" + this.state.hitokoto.id}>{this.state.hitokoto.id}</a>
                                    </Container>
                                </Segment>}
                                <Header>
                                    <h2>近期题目</h2>
                                </Header>
                                <Segment stacked>
                                    <Table basic="very" celled>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell textAlign="center">题目名</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">时间</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                this.state.data.recent_problems.map(curr => <Table.Row key={curr.id}>
                                                    <Table.Cell textAlign="center">
                                                        <Link to={"/show_problem/" + curr.id}>{curr.title}</Link>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center">{curr.create_time}</Table.Cell>
                                                </Table.Row>)
                                            }
                                        </Table.Body>
                                    </Table>
                                </Segment>
                                <Header>
                                    <h2>近期讨论</h2>
                                </Header>
                                <Segment stacked>
                                    <Table basic="very" celled>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell textAlign="center">标题</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">时间</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                this.state.data.discussions.map(curr => <Table.Row key={curr.id}>
                                                    <Table.Cell textAlign="center">
                                                        <Link to={"/show_discussion/" + curr.id}>{curr.title}</Link>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center">{curr.time}</Table.Cell>
                                                </Table.Row>)
                                            }
                                        </Table.Body>
                                    </Table>
                                </Segment>
                                <Header>
                                    <h2>友情链接</h2>
                                </Header>
                                <Segment stacked>
                                    <List>
                                        {this.state.data.friend_links.map((item, i) => <List.Item key={i} as="a" href={item.url}>{item.name}</List.Item>)}
                                    </List>
                                </Segment>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            );

        } else {
            return <></>;
        }
    }
}

export default connect("base")(HomePage);