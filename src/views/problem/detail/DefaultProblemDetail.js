import React, { useState } from "react";
import { Header, Container, Button, Segment, Table, Modal } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
import qs from "qs";
import { connect } from "nycticorax";
import { Link, withRouter } from "react-router-dom";
import JudgeStatusLabel from "../../utils/JudgeStatusLabel";
import ReactDOM from "react-dom";
import "./current.css";
import MessageBox from "../../utils/Modal";
import { BACKEND_BASE_URL } from "../../../index";
function RemoveProblemModal({ onConfirmed, onClose }) {
    let [open, setOpen] = useState(true);
    return <Modal
        size="small"
        open={open}
        onClose={onClose}
    >
        <Modal.Header>
            您确定要删除此题目吗
        </Modal.Header>
        <Modal.Content>
            <p>删除题目会发生以下后果</p>
            <p>1.所有关于该题目的提交会被删除</p>
            <p>2.所有现在正在使用该题目的比赛将会无法正常访问</p>
        </Modal.Content>
        <Modal.Actions>
            <Button color="green" onClick={() => (setOpen(false), onConfirmed())}>确定</Button>
            <Button color="red" onClick={() => setOpen(false)}>关闭</Button>
        </Modal.Actions>
    </Modal>;
}
function removeProblem(problemID, callback) {
    const element = document.createElement("div");
    const remove = () => {
        console.log("removing", problemID);
        // document.removeChild(element);
        axios.post("/api/problem/remove", qs.stringify({ problem_id: problemID })).then(resp => {
            let data = resp.data;
            if (data.code) {
                MessageBox.show(data.message);
                return;
            } else {
                callback();
            }
        });
    };

    document.body.appendChild(element);
    ReactDOM.render(<RemoveProblemModal
        onClose={() => ReactDOM.unmountComponentAtNode(element)}
        onConfirmed={remove}
    ></RemoveProblemModal>, element);
}
function ShowFilesModal({ files, downloads, problemID, onClose }) {
    // let [open, setOpen] = useState(true);
    return <Modal
        // open={open}
        open={true}
        onClose={onClose}
        size="small"
    >
        <Modal.Header>文件下载</Modal.Header>
        <Modal.Content style={{ overflowY: "scroll" }}>
            <Table basic="very" celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell content="文件名" />
                        <Table.HeaderCell content="大小" />
                        <Table.HeaderCell content="操作" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {files.map(item => downloads.includes(item.name) && <Table.Row key={item.name}>
                        <Table.Cell>
                            {item.name}
                        </Table.Cell>
                        <Table.Cell>
                            {item.size / 1024} KBytes
                    </Table.Cell>
                        <Table.Cell>
                            <Button color="green" as="a" href={BACKEND_BASE_URL + `/api/download_file/${problemID}/${item.name}`}>
                                下载
                            </Button>
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>
        </Modal.Content>
    </Modal>
}
function showAllFiles(problemID, files, downloads) {
    const element = document.createElement("div");
    document.body.appendChild(element);
    ReactDOM.render(<ShowFilesModal
        downloads={downloads}
        files={files}
        problemID={problemID}
        onClose={() => {
            ReactDOM.unmountComponentAtNode(element);
            // document.removeChild(element);
        }}
    ></ShowFilesModal>, element);
}
function _ProblemDetail({
    base,
    history,
    id,
    uploader,
    createTime,
    isPublic,
    totalScore,
    mySubmission,
    mySubmissionStatus,
    acceptedCount,
    submissionCount,
    usingFileIO,
    inputFileName,
    outputFileName,
    spjFileName,
    managable,
    files,
    downloads,
    recentDiscussions,
    inContest,
    isRemote,
    remoteOJDisplay,
    remoteProblemID
}) {

    const Line = ({ name, children }) => <Table.Row>
        <Table.Cell>{name}</Table.Cell><Table.Cell>{children}</Table.Cell>
    </Table.Row>;
    return <div style={{
        position: "fixed",
        marginLeft: 750,
        marginTop: 100,
        top: 50
    }}>
        <Segment stacked style={{ maxWidth: 300, wordBreak: "break-all" }}>
            <Table collapsing celled basic="very" className="fluid">
                <Table.Body>
                    {
                        (() => {
                            if (inContest && isRemote) {
                                return <Table.Row>
                                    <Table.Cell>评测方式</Table.Cell>
                                    <Table.Cell>{remoteOJDisplay}</Table.Cell>
                                </Table.Row>
                            } else {
                                return <>
                                    {!inContest && <Line name="题目上传者">
                                        <Link to={"/profile/" + uploader.uid} >{uploader.username}</Link>
                                    </Line>}
                                    {!inContest && <Line name="上传时间" style={{ wordBreak: "break-all" }}>
                                        {createTime}
                                    </Line>}
                                    {!inContest && <Line name="是否公开">
                                        {isPublic ? "Yes" : "No"}
                                    </Line>}
                                    <Line name="题目分数" >
                                        {totalScore}
                                    </Line>
                                    {!inContest && <Line name="我的提交">
                                        {mySubmission === -1 ?
                                            <div>尚未提交</div> :
                                            <Link to={"/show_submission/" + mySubmission}>
                                                <JudgeStatusLabel status={mySubmissionStatus}>
                                                </JudgeStatusLabel></Link>}
                                    </Line>}
                                    {!inContest && <Line name="通过数/提交数/通过率">
                                        {acceptedCount}/{submissionCount}/{parseInt(acceptedCount / submissionCount * 100)}%
                                    </Line>}
                                    {usingFileIO &&
                                        !isRemote &&
                                        <Line name="输入/输出文件">
                                            {inputFileName}<br />
                                            {outputFileName}
                                        </Line>}
                                    {!isRemote && <Line name="评测方式">
                                        {!spjFileName ? "文本比较" : "Special Judge"}
                                    </Line>}
                                    {isRemote && <Line name="评测方式">远程评测: {remoteOJDisplay}</Line>}
                                    {isRemote && <Line name="远程题目ID">{remoteProblemID}</Line>}
                                </>;

                            }
                        })()
                    }
                </Table.Body>
            </Table>
            {!inContest && <>
                {(managable || base.uid === uploader.uid) && <Link to={"/problem_edit/" + id}>编辑</Link>}
                {(managable || base.uid === uploader.uid) && <a onClick={() => removeProblem(id, () => history.push("/"))}>删除题目</a>}
                <a onClick={() => history.push({
                    pathname: "/submissions/1", state: {
                        filter: {
                            uid: base.uid,
                            problem: id
                        }
                    }
                })}>我的提交</a>
                <a onClick={() => history.push({
                    pathname: "/submissions/1", state: {
                        filter: {
                            problem: id
                        }
                    }
                })}>全部提交</a>
                <a onClick={() => history.push({
                    pathname: "/submissions/1", state: {
                        filter: {
                            problem: id,
                            statue: "accepted"
                        }
                    }
                })}>通过提交</a>

            </>}
            {
                downloads.length !== 0 && <div>
                    <Header>
                        <h4>文件下载</h4>
                    </Header>
                    {
                        downloads.map((file, i) => i < 5 && <a style={{ paddingRight: 5 }} key={i} href={BACKEND_BASE_URL + "/api/download_file/" + id + "/" + file}>
                            {file}
                        </a>)
                    }
                    <Container textAlign="right">
                        <a onClick={() => showAllFiles(id, files, downloads)}>查看全部</a>
                    </Container>
                </div>
            }
        </Segment>
        <Segment style={{ maxWidth: 300 }} stacked>
            <Header>
                <h4>讨论</h4>
            </Header>
            {
                recentDiscussions.length === 0 ? <div>无</div> : <Table basic="very" collapsing celled>
                    <Table.Body>
                        {recentDiscussions.map(item => <Table.Row key={item.id}>
                            <Table.Cell>
                                <Link to={"/show_discussion/" + item.id}>{item.title}</Link>
                            </Table.Cell>
                        </Table.Row>)}
                    </Table.Body>
                </Table>
            }
        </Segment>
    </div>;
}

const DefaultProblemDetail = withRouter(connect("base")(_ProblemDetail));

export default DefaultProblemDetail;