import React, { useState, useEffect } from "react";
import MessageBox from "../utils/Modal";
import { connect } from "nycticorax";
// import { ProblemMeta, DefaultProblemSubmit, ProblemDetail } from "./ProblemBase";
import ProblemMeta from "./ProblemMeta";
import DefaultProblemSubmit from "./submit/DefaultProblemSubmit";
import DefaultProblemDetail from "./detail/DefaultProblemDetail";
import axios from "axios";
import qs from "qs";
function ShowProblemPage({ base, match, history }) {
    let isContest = match.params.contestID ? true : false;
    let contestID = match.params.contestID ? parseInt(match.params.contestID) : -1;
    let [loaded, setLoaded] = useState(false);
    let [done, setDone] = useState(false);
    let [data, setData] = useState({});
    let [languages, setLanguages] = useState([]);
    let [isRemote, setIsRemote] = useState(false);
    useEffect(() => {
        if (!loaded) {
            setLoaded(true);
            if (isContest) {
                //TODO: 比赛题目显示页面
            } else {
                axios.post("/api/get_problem_info", qs.stringify({
                    id: match.params.problemID
                })).then(resp => {
                    let data = resp.data;
                    if (data.code) {
                        MessageBox.show(data.message);
                        return;
                    } else {
                        data = data.data;
                        console.log(data);
                        document.title = `${data.title} - ${data.id} - ${base.appName}`;
                        setData(data);
                        setLanguages(data.languages);
                        setDone(true);
                    }
                });
            }
        }
    }, [loaded, isContest, match.params.problemID, base.appName]);
    if (done) {
        return <div style={{ top: "10%", maxWidth: 700 }}>
            <ProblemMeta
                background={data.background}
                content={data.content}
                examples={data.example}
                hint={data.hint}
                id={data.id}
                inputFormat={data.input_format}
                outputFormat={data.output_format}
                subtasks={data.subtasks}
                title={data.title}
            />
            <DefaultProblemSubmit
                style={{ paddingTop: 30 }}
                defaultCode={data.last_code}
                defaultLanguage={data.last_lang ? data.last_lang : languages[0].id}
                languages={languages}
                extraParameters={data.extra_parameter}
                defaultParameters={data.lastUsedParameters}
                problemID={data.id}
                contestID={contestID}
            />
            {
                !isRemote && <DefaultProblemDetail
                    id={data.id}
                    uploader={data.uploader}
                    createTime={data.create_time}
                    isPublic={data.public}
                    totalScore={data.score}
                    mySubmission={data.my_submission}
                    mySubmissionStatus={data.my_submission_status}
                    acceptedCount={data.accepted_count}
                    submissionCount={data.submission_count}
                    usingFileIO={data.using_file_io}
                    inputFileName={data.input_file_name}
                    outputFileName={data.output_file_name}
                    spjFileName={data.spj_file_name}
                    managable={data.managable}
                    files={data.files}
                    downloads={data.downloads}
                    recentDiscussions={data.recentDiscussions}
                    inContest={isContest}
                    isRemote={false}
                />
            }
        </div>
    } else return null;
}

export default connect("base")(ShowProblemPage);