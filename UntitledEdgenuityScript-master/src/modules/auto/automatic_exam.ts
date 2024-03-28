/*  -----------------------------------------------------------------------------------------------

    -- automatic-instruction.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This module attempts to automate exams (tests, quizzes) using a database of questions and answers.
    This module is not force enabled, but automatically activated when "Auto Answers" is enabled.

    ----------------------------------------------------------------------------------------------- */

    import { Module } from "../modules";
    import { getStageFrame } from "../utilities/get_stage_frame";
    import { GMXMLHttpRequestOptions, GMXMLHttpRequestResponse } from '../../types/greasemonkey.types';
    import { getActivityTitle } from "../utilities/get_activity_title";
    
    declare function GM_xmlhttpRequest(options: GMXMLHttpRequestOptions): Promise<GMXMLHttpRequestResponse>;

    const whitelisted_activities = ["quiz", "unittest", "unittestreview", "cumulativeexam", "practice", "pretest", "topicreviewactivity", "exam", "testreview", "test", "gcquiz", "cumulativereviewactivity"];
    
    
    /*
        This function operates on a pretty simple principle:
            - Get the answer ID from every possible answer.
            - Query the database with each one until we get a good response
            - If we get a good response, we can stop querying the database and just use that answer, because that is the correct answer.
            - If we somehow don't get a good response in the end, then we will notify the user that we couldn't find the answer, and that they'll need to look it up themselves.
    */

    let alreadyRequested: String[] = [];
    
    export async function retrieveAnswerFromDB(answerID: string) {
        return new Promise((resolve, reject) => {
            // Make a request to the database to get the answer.
            // If we have already requested this answer, then we don't need to request it again. We can just resolve the answerID.
            if (alreadyRequested.includes(answerID)) {
                return resolve(answerID);
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.revoltedge.shop/assignquiz?aid=" + answerID,
                onload: (response: any) => {
                    alreadyRequested.push(answerID);
                    return resolve(response);
                },
                onerror: (response: any) => {
                    return reject(response);
                }
            });
        })
        // Make a request to the database to get the answer.
        // return GM.xmlHttpRequest({
        //     method: "GET",
        //     url: "https://api.revoltedge.shop/assignquiz?aid=" + answerID,
        // });
    }
    
    let previousQuestionIDs: String[] = [];
    
    export async function gatherExamQuestions(): Promise<String[]> {
        const stageFrame = getStageFrame();
        if (!stageFrame) return [];
        if (!stageFrame.contentDocument) return [];
        const questionElements = stageFrame.contentDocument.getElementsByClassName("answer-choice-button");
        if (!questionElements) return [];
    
        if (previousQuestionIDs.length > 0) {
            // Check if the previous question IDs are the same as the current question IDs.
            // If they are, then we don't need to do anything.
            // If they are not, then we need to reset the previousQuestionIDs array.
            let currentQuestionIDs: String[] = [];
            Array.from(questionElements).forEach((element: Element) => {
                currentQuestionIDs.push(element.id);
            });
            if (previousQuestionIDs.toString() !== currentQuestionIDs.toString()) {
                previousQuestionIDs = [];
                previousQuestionIDs.push(...currentQuestionIDs)
                return currentQuestionIDs;
            }
        } else {
            // If the previousQuestionIDs array is empty, then we need to fill it.
            Array.from(questionElements).forEach((element: Element) => {
                previousQuestionIDs.push(element.id);
            });
            return previousQuestionIDs;
        }
        // If we somehow reach here, then we need to return an empty array. This should never happen.
        return [];
    }
    
    let questionInterval: NodeJS.Timeout | null = null;
    
    async function activateAutomaticExam() {
    questionInterval = setInterval(async () => {
        let activityTitleEle = document.getElementById("activity-title")
        let examFinished = false;
        if (activityTitleEle) {
            let activityTitle = getActivityTitle();
            if (activityTitle && whitelisted_activities.includes(activityTitle)) {
                let SF = getStageFrame();
                if (SF && SF.contentDocument) {
                    let answeredQuestions = SF.contentDocument.querySelectorAll('.plainbtn.alt.icon.yellow');
                    let totalQuestions = SF.contentDocument.querySelectorAll("[buttonindex]")
                    if (answeredQuestions.length !== 0 && answeredQuestions.length == totalQuestions.length) {
                        if (questionInterval) clearInterval(questionInterval);
                        examFinished = true;
                    }
                }
                gatherExamQuestions().then((questions: String[]) => {
                    let questionsNotFound = 0;
                    if (questions.length > 0) {
                        questions.forEach((question: String) => {
                            retrieveAnswerFromDB(question.toString()).then((response: any) => {
                                if (Number(response.status) == 200) {
                                    let answer = JSON.parse(response.response).question_id;
                                    let stageFrame = getStageFrame();
                                    if (stageFrame && stageFrame.contentDocument) {
                                    let answerElement = stageFrame.contentDocument.getElementById(answer) as HTMLInputElement;
                                    if (answerElement) {
                                        let answerElementType = (answerElement as HTMLInputElement).type
                                        if (answerElementType == "radio") {
                                            answerElement.click();
                                        } else if (answerElementType == "checkbox") {
                                            if (answerElement.checked == false) {
                                                answerElement.click();
                                            }
                                        } else {
                                            questionsNotFound++;
                                        }
                                    }
                                }
                            }
                        });
                    });
                    if (questionsNotFound !== questions.length) {
                        setTimeout(async () => {
                            if (examFinished) {
                                let SF = getStageFrame();
                                if (SF && SF.contentDocument) {
                                    let submitBtn = SF.contentDocument.getElementById("submit");

                                    let submitTimeout = await GM.getValue("submit-delay") as number;
                                    if (submitTimeout) {
                                        // Start timer to submit the exam.
                                        let lessonInfo = document.getElementById('lessonInfo')
                                        let submitTimerEle = document.createElement('div');
                                        if (lessonInfo) lessonInfo.appendChild(submitTimerEle);
                                        let submitTimer = setInterval(() => {
                                            submitTimerEle.innerHTML = "Submitting in " + submitTimeout + " seconds.";
                                            submitTimeout--;
                                            
                                            if (submitTimeout <= 0) {
                                                clearInterval(submitTimer);
                                                submitTimerEle.remove();
                                                if (submitBtn) {
                                                    submitBtn.click();
                                                    let SF = getStageFrame();
                                                    if (SF && SF.contentDocument) {
                                                        let submitConfirmMessage = SF.contentDocument.getElementById('submitConfirmMessage')
                                                        if (submitConfirmMessage) {
                                                            let submitConfirmBtn = submitConfirmMessage.getElementsByClassName('uibtn uibtn-blue uibtn-med submit') as HTMLCollectionOf<HTMLButtonElement>;
                                                            if (submitConfirmBtn) submitConfirmBtn[0].click();
                                                        }
                                                    }
                                                }
                                            }
                                        }, 1000);
                                        if (submitBtn) {
                                            submitBtn.click();
                                        }
                                    } else {
                                        if (submitBtn) {
                                            submitBtn.click();
                                        }
                                    }

                                }
                            } else {
                                let SF = getStageFrame();
                                if (SF && SF.contentDocument) {
                                    let nextBtn = SF.contentDocument.getElementById("nextQuestion");
                                    if (nextBtn) nextBtn.click();   
                                }
                            }

                        }, 2500);
                    }
                    }
                });
            }
        }
    }, 1000);
}
function deactivateAutomaticExam() {
    if (questionInterval) {
        clearInterval(questionInterval);
    }
}
    
    export const automaticExam: Module = {
        name: "Automatic Exam",
        activate:  activateAutomaticExam,
        deactivate: deactivateAutomaticExam,
    };
    
    export default automaticExam