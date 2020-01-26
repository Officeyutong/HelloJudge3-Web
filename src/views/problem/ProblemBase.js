import React, { useState } from "react";
import { Header, Container, Grid, Button, Icon, Segment, Table, Menu } from "semantic-ui-react";
import Clipboard from "clipboard";
import { renderMarkdown } from "../../utils/utils";
import ACE from "react-ace";
const problemMetaStyle = {
    paddingBottom: 30,
    wordWrap: "break-all"
};
function ProblemMetaItem({ name, value, usePre }) {
    return value !== "" && <Container style={problemMetaStyle}>
        <Grid columns="2" className="fluid">
            <Grid.Column>
                <Header content={<h3>{name}</h3>} />
            </Grid.Column>
            <Grid.Column textAlign="right">
                <Button size="tiny" circular color="orange" data-clipboard-text={value}>
                    <Icon name="clipboard outline" />
                </Button>
            </Grid.Column>
        </Grid>
        <Segment>
            {
                usePre ? <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {value}
                </pre> : <div dangerouslySetInnerHTML={{ __html: value }} >

                    </div>
            }
        </Segment>
    </Container>;
}
function ProblemMeta({
    id,
    title,
    background,
    content,
    inputFormat,
    outputFormat,
    examples,
    subtasks,
    hint
}) {
    return <>
        <Header content={<h1>{id}: {title}</h1>} />
        <ProblemMetaItem name="题目背景" value={background} />
        <ProblemMetaItem name="题目内容" value={content} />
        <ProblemMetaItem name="输入格式" value={inputFormat} />
        <ProblemMetaItem name="输出格式" value={outputFormat} />
        {
            examples.map((item, index) => <Grid key={index} columns="2">
                <Grid.Column>
                    <ProblemMetaItem name={`样例 ${index + 1} 输入`} value={item.input} usePre={true} />
                </Grid.Column>
                <Grid.Column>
                    <ProblemMetaItem name={`样例 ${index + 1} 输出`} value={item.output} usePre={true} />
                </Grid.Column>
            </Grid>)
        }
        {
            subtasks && <Container>
                <Header>
                    <h3>子任务</h3>
                </Header>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell content="子任务名" />
                            <Table.HeaderCell content="评分方式" />
                            <Table.HeaderCell content="时间限制" />
                            <Table.HeaderCell content="内存限制" />
                            <Table.HeaderCell content="说明" />
                            <Table.HeaderCell content="分数" />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            subtasks.map((subtask, index) => <Table.Row key={index}>
                                <Table.Cell content={subtask.name} />
                                <Table.Cell content={{ min: "取最小值", sum: "求和" }[subtask.method]} />
                                <Table.Cell content={subtask.time_limit + "ms"} />
                                <Table.Cell content={subtask.memory_limit + "MB"} />
                                <Table.Cell dangerouslySetInnerHTML={{ __html: renderMarkdown(subtask.comment) }} />
                                <Table.Cell content={subtask.score} />
                            </Table.Row>)
                        }
                    </Table.Body>
                </Table>
            </Container>
        }
        <ProblemMetaItem name="提示" value={hint} />
    </>;
}

function DefaultProblemSubmit({
    defaultCode,
    languages,
    defaultLanguage,
    extraParameters,
    defaultParameters
}) {
    let [code, setCode] = useState(defaultCode);
    let [language, setLanguage] = useState(defaultLanguage);
    let [currentParameter, setCurrentParameter] = useState(defaultParameters);
    return <Container>
        <Header>
            <h3>提交代码</h3>
        </Header>
        <Grid columns="1">
            <Grid.Column>
                <Grid columns="2" style={{ minHeight: 500 }}>
                    <Grid.Column width="4">
                        <Menu pointing vertical style={{
                            overflowY: "scroll", height: 500, maxWidth: 170, overflowX: "hidden"
                        }}>
                            {
                                Object.entries(languages).map(([key, val]) => <Menu.Item as="a" key={key} active={language === key} onClick={() => setLanguage(key)}>
                                    <span>
                                        <Header as="span">
                                            <h4>{val.display}</h4>
                                        </Header>{val.version}
                                    </span>
                                </Menu.Item>)
                            }
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width="12" style={{ paddingLeft: 0 }}>
                        <Container>
                            <ACE
                                mode={languages[language].ace_mode}
                                theme="github"
                                style={{ left: 30, minHeight: 500 }}
                                onChange={(str) => setCode(str)}
                                value={code}
                            ></ACE>
                        </Container>
                    </Grid.Column>
                </Grid>
            </Grid.Column>
        </Grid>
    </Container>
}

export {
    ProblemMeta,
    DefaultProblemSubmit
};