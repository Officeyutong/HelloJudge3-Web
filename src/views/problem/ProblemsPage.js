import React, { useState, useEffect } from "react";
import PageMenu from "../utils/PageMenu";
// import ScoreLabel from "../utils/ScoreLabel";
// import JudgeStatusLabel from "../utils/JudgeStatusLabel";
import axios from "axios";
import qs from "qs";
import MessageBox from "../utils/Modal";
import { Header, Segment, Container, Button, Icon, Input, Divider, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "nycticorax";
import url from "url";


function ProblemsPage({ base, match, location, history }) {
    let [done, setDone] = useState(false);
    let [loaded, setLoaded] = useState(false);
    let [pageCount, setPageCount] = useState(-1);
    let [data, setData] = useState({});
    let [searching, setSearching] = useState("");
    let page = parseInt(match.params.page);
    let searchKeyword = url.parse(location.search, true).query.search_keyword;

    const addProblem = () => {
        axios.post("/api/create_problem").then(resp => {
            let data = resp.data;
            if (data.code) {
                MessageBox.show(data.message);
                return;
            } else {
                history.push("/show_problem/" + data.problem_id);
            }
        });
    }
    const gotoPage = (page, text) => {
        console.log("Searching", text);
        console.log(history);
        // console.log(text.length);
        // return;
        if (text && text.length !== 0) {
            window.location.href = `/problems/${page}?search_keyword=` + encodeURIComponent(text);

        } else {
            window.location.href = `/problems/${page}`;

        }
        // history.push(`/problems/${page}?search_keyword=` + encodeURIComponent(text));


    };
    useEffect(() => {
        if (!loaded) {
            setLoaded(true);
            document.title = "题目列表 - " + base.appName;
            if (searchKeyword) {
                setSearching(searchKeyword);
            }
            console.log("Loading...page:", match.params.page, "search keyword:", searchKeyword);
            let toSearch = searchKeyword && searchKeyword.length !== 0 ? qs.stringify({
                page: match.params.page,
                search_keyword: searchKeyword
            }) : qs.stringify({
                page: match.params.page,
            });
            axios.post("/api/problem_list", toSearch).then(resp => {
                let data = resp.data;
                if (data.code) {
                    MessageBox.show(data.message);
                    return;
                } else {
                    console.log(data);
                    setPageCount(data.page_count);
                    setData(data.data);
                    setDone(true);
                }
            });
        }
    });
    if (!done) return null;
    else {
        return <>
            <Header style={{ marginBottom: "50px" }}>
                <h1>题库</h1>
            </Header>
            <Segment stacked>
                <Container textAlign="right">
                    <Button as={Link} to="/remote_judge/add_problem" color="blue">
                        <Icon name="plus" />添加远程题目...
                    </Button>
                    <Button as={Link} to="/import_from_syzoj" color="blue">
                        <Icon name="plus" />从SYZOJ导入题目...
                    </Button>
                    <Button color="green" onClick={addProblem}>
                        <Icon name="plus" />添加题目...
                    </Button>

                </Container>
                <Input
                    icon={{ name: "search", circular: true }}
                    placeholder="搜索题目名..."
                    value={searching}
                    onChange={evt => setSearching(evt.target.value)}
                    onKeyUp={evt => { if (evt.keyCode === 13) gotoPage(1, evt.target.value) }}
                ></Input>
                <Divider />
                <div>
                    <Table basic="very" >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center" style={{ maxWidth: 80, width: 80 }} content="题目编号" />
                                <Table.HeaderCell content="题目" />
                                <Table.HeaderCell content="通过数" />
                                <Table.HeaderCell content="提交数" />
                                <Table.HeaderCell content="通过率" />
                                <Table.HeaderCell content="我的提交" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                data.map(item => <Table.Row key={item.id} positive={item.status && item.status === 'accepted'} negative={item.status && item.status !== 'unaccepted'}>
                                    <Table.Cell textAlign="center" style={{ maxWidth: 80, width: 80 }}>
                                        {item.id}
                                    </Table.Cell>
                                    <Table.Cell style={{ minWidth: 400 }}>
                                        <Link to={"/show_problem/" + item.id} style={{ color: item.public ? "" : "green" }}>{item.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.accepted_count}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.total_submit}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {parseInt(item.accepted_count / item.total_submit * 100)}%
                                    </Table.Cell>
                                    <Table.Cell>
                                        {
                                            item.submission !== -1 && <Link
                                                to={"/show_submission/" + item.submission}
                                            >
                                                {item.submission}
                                            </Link>
                                        }
                                    </Table.Cell>
                                </Table.Row>)
                            }
                        </Table.Body>
                    </Table>
                    <PageMenu
                        callback={(item) => gotoPage(item, searchKeyword)}
                        currentPage={page}
                        pageCount={pageCount}
                    />
                </div>
            </Segment>
        </>;
    }
};
export default connect("base")(ProblemsPage);
