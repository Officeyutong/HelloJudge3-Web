import React from "react";
import axios from "axios";
import qs from "qs";
import MessageBox from "../utils/Modal";
import { connect } from "nycticorax";
import { renderMarkdown } from "../../utils/utils";
import { Grid, Card, Image, Header, Segment, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import md5 from "md5";
class ProfilePage extends React.Component {
    state = {
        uid: -1,
        data: {},
        done: false
    }
    constructor(props) {
        super(props);
        console.log(props);
        // this.setState({ uid: props.params.uid });
        this.state = {
            uid: props.match.params.uid,
            data: {},
            done: false
        };
    }
    componentDidMount() {
        axios.post("/api/get_user_profile", qs.stringify({ uid: this.state.uid })).then(resp => {
            let data = resp.data;
            if (data.code) {
                MessageBox.show(data.message);
            } else {
                data = data.data;
                data.ac_problems.sort((x, y) => x - y);
                this.setState({
                    data: data,
                    done: true
                });
                console.log(data);
            }
        });
    }
    componentWillReceiveProps(props) {
        document.title = `${this.state.data.username} - ${this.state.uid} - ${props.base.appName}`;
    }
    render() {
        let data = this.state.data;
        if (this.state.done) {
            console.log(data);
            return <>
                <div style={{
                    top: "10%",
                    maxWidth: 1000
                }}>
                    <Grid style={{ width: "100%" }}>
                        <Grid.Row>
                            <Grid.Column width="5">
                                <Card style={{ width: "100%" }}>
                                    <Image style={{
                                        width: 284, height: 284
                                    }} src={"https://www.gravatar.com/avatar/" + md5(data.email) + "?s=200"}></Image>
                                    <Card.Content>
                                        <Card.Header content={data.username} />
                                        <Card.Meta content={<span>注册于 {data.register_time}</span>} />
                                        <Card.Meta content={data.group_name} />
                                    </Card.Content>
                                    <Card.Content extra style={{ color: "black" }}>
                                        <div>Rating: {data.rating}</div>
                                        <div>Email: {data.email}</div>
                                    </Card.Content>
                                    {data.banned && <Card.Content extra>
                                        <span style={{ color: "red" }}>此账户已被封禁
                                            </span></Card.Content>}
                                    {(data.managable || this.props.base.uid === data.id) &&
                                        <Card.Content extra>
                                            <Link to={"/profile_edit/" + data.id} style={{ color: "black" }}>编辑</Link>
                                        </Card.Content>
                                    }
                                </Card>
                                <Header as="h4" block attached>
                                    Rating历史
                                </Header>
                                <Segment attached="bottom">
                                    {
                                        (data.rating_history.length === 0) ? <div>这个人很懒，没参加过任何Rated比赛...</div> :
                                            <Table basic="very" celled>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell content="比赛" />
                                                        <Table.HeaderCell content="变化" />
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {data.rating_history.map(item => <Table.Row key={item}>
                                                        <Table.Cell >
                                                            <Link to={"/contest/" + item.contest_id} content={item.content_name}></Link>
                                                        </Table.Cell>
                                                        <Table.Cell style={{ color: item.result >= 0 ? "green" : "red" }} content={item.result >= 0 ? `+${item.result}` : `-${-item.result}`} />
                                                    </Table.Row>)}
                                                </Table.Body>
                                            </Table>
                                    }
                                </Segment>
                                <Header as="h4" block attached content="通过题目" />
                                <Segment attached="bottom">
                                    {
                                        (data.ac_problems.length === 0) ? <div>这个人很懒,还没有做过题...</div> :
                                            data.ac_problems.map(item => <Link key={item} to={"/show_problem/" + item} > {item} </Link>)
                                    }
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width="11">
                                <Header>
                                    <h1>{data.username}</h1>
                                </Header>
                                {
                                    data.description ? <Segment stacked style={{ maxHeight: "1000px" }}>
                                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(data.description) }}></div>
                                    </Segment> : <Segment stacked style={{ height: "100%" }} content="这个人好懒...什么都没有写..." />
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </div>
            </>;
        } else {
            return <></>;
        }
    }
};

export default connect("base")(ProfilePage);