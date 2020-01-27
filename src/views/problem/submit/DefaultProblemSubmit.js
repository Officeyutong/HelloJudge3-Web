import React, { useState } from "react";
import { Header, Container, Grid, Button, Checkbox, Segment, Table, Menu, Icon } from "semantic-ui-react";
import ACE from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import _ from "lodash";
import axios from "axios";
import qs from "qs";
import MessageBox from "../../utils/Modal";
import { withRouter } from "react-router-dom";
function DefaultProblemSubmit({
    history,
    defaultCode,
    languages,
    defaultLanguage,
    extraParameters,
    defaultParameters,
    problemID,
    contestID
}) {
    let [code, setCode] = useState(defaultCode);
    let [language, setLanguage] = useState(defaultLanguage);
    let [currentParameter, setCurrentParameter] = useState(defaultParameters);
    let [running, setRunning] = useState(false);
    let languageDict = {};
    const submit = () => {
        setRunning(true);
        axios.post("/api/submit", qs.stringify({
            problem_id: problemID,
            code: code,
            language: language,
            contest_id: contestID,
            usedParameters: JSON.stringify(currentParameter)
        })).then(resp => {
            let data = resp.data;
            if (data.code) {
                MessageBox.show(data.message);
                return;
            } else {
                history.push(`/show_submission/${data.submission_id}`);
            }
        });
    };
    for (let item of languages) {
        languageDict[item.id] = item;
    }
    let aceMode = languageDict[language].ace_mode;
    require(`ace-builds/src-noconflict/mode-${aceMode}`);
    require(`ace-builds/src-noconflict/snippets/${aceMode}`);
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
                                Object.entries(languageDict).map(([key, val]) => <Menu.Item as="a" key={key} active={language === key} onClick={() => setLanguage(key)}>
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
                                mode={languageDict[language].ace_mode}
                                theme="github"
                                style={{ left: 30, minHeight: 500 }}
                                onChange={(str) => setCode(str)}
                                value={code}
                                // enableBasicAutocompletion={true}
                                // enableSnippets={true}
                                // enableLiveAutocompletion={true}
                                fontSize="15px"
                            ></ACE>
                        </Container>
                    </Grid.Column>
                </Grid>
            </Grid.Column>
            <Grid.Column>
                <Segment>
                    <Table celled basic="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell content="名称" />
                                <Table.HeaderCell content="参数" />
                                <Table.HeaderCell content="" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                extraParameters.map((item, i) => language.match(item.lang) && <Table.Row key={i}>
                                    <Table.Cell content={item.name} />
                                    <Table.Cell content={item.parameter} />
                                    <Table.Cell>
                                        <Checkbox
                                            toggle
                                            disabled={item.force}
                                            checked={currentParameter.includes(i) || item.force}
                                            onChange={
                                                () => {
                                                    if (currentParameter.includes(i)) {
                                                        setCurrentParameter(_.filter(currentParameter, x => x !== i));
                                                    } else {
                                                        setCurrentParameter([...currentParameter, i]);
                                                    }
                                                }
                                            }
                                        ></Checkbox>
                                    </Table.Cell>
                                </Table.Row>)
                            }
                        </Table.Body>
                    </Table>
                </Segment>
            </Grid.Column>
            <Container textAlign="center">
                <Button color="green" onClick={submit} loading={running}>
                    <Icon name="paper plane outline" />提交
                </Button>

            </Container>
        </Grid>
    </Container>
}

export default withRouter(DefaultProblemSubmit);