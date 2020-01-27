import React from "react";
import { Header, Container, Grid, Button, Segment, Table} from "semantic-ui-react";
import { renderMarkdown, copyText } from "../../utils/utils";



const problemMetaStyle = {
    paddingBottom: 30,
    wordWrap: "break-all"
};
function ProblemMetaItem({ name, value, usePre = false, render = true }) {
    let content = render ? renderMarkdown(value) : value;
    return value !== "" && <Container style={problemMetaStyle}>
        <Grid columns="2" className="fluid">
            <Grid.Column>
                <Header content={<h3>{name}</h3>} />
            </Grid.Column>
            <Grid.Column textAlign="right">
                <Button circular color="orange" icon="clipboard outline" onClick={() => copyText(content)}>
                </Button>
            </Grid.Column>
        </Grid>
        <Segment>
            {
                usePre ? <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {content}
                </pre> : <div dangerouslySetInnerHTML={{ __html: content }} />
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
                    <ProblemMetaItem name={`样例 ${index + 1} 输入`} value={item.input} usePre={true} render={false} />
                </Grid.Column>
                <Grid.Column>
                    <ProblemMetaItem name={`样例 ${index + 1} 输出`} value={item.output} usePre={true} render={false} />
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
                                <Table.Cell  >
                                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(subtask.comment) }} />
                                </Table.Cell>
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

export {
    ProblemMeta,
    ProblemMetaItem
};
export default ProblemMeta;