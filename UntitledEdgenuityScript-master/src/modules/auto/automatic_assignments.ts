/*  -----------------------------------------------------------------------------------------------

    -- automatic_assignments.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This module attempts to automate assignments using a database of questions and answers.
    This module is not force enabled, but automatically activated when "Auto Answers" is enabled.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "../modules";
import { getStageFrame, getIframePreview } from "../utilities/get_stage_frame";

async function getAssignmentAnswerFromDB(questionID: string, isImp?: boolean) {
    let url = "https://api.revoltedge.shop/assignquiz?aid=" + questionID;
    if (isImp) {
        url = "https://api.revoltedge.shop/inpanswer?qid=" + questionID;
    }
    return GM.xmlHttpRequest({
        method: "GET",
        url: url,
    });
}

function attemptToAnswerQuestion() {
    let stageFrame = getStageFrame();
    if (stageFrame !== null) {
        if (stageFrame.contentDocument !== null) {
            let iframePreview = getIframePreview();
            if (iframePreview !== null) {
                if (iframePreview.contentDocument !== null) {
                    if (iframePreview.contentDocument.getElementsByTagName('textarea').length > 0) {
                        let textAreaEle = iframePreview.contentDocument.getElementsByTagName('textarea')[0];
                        let readingPanel = iframePreview.contentDocument.querySelector(".reading") as HTMLDivElement;
                        if (readingPanel) {
                            let readingPanelText = readingPanel.innerText;
                            textAreaEle.value = readingPanelText;
                            let SF = getStageFrame();
                            if (SF && SF.contentWindow) {
                                (<any>SF.contentWindow).API.Frame.check();
                                (<any>SF.contentWindow).API.Frame.check();
                            }
                        }
                    } else {
                        let answerChoiceButtons = iframePreview.contentDocument.getElementsByClassName("answer-choice-button");
                        let clickCount = 0;
                        if (answerChoiceButtons.length > 0) {
                            const clickPromises = Array.from(answerChoiceButtons).map((element: Element) => {
                                return new Promise<void>((resolve) => {
                                    let questionID = element.id;
                                    getAssignmentAnswerFromDB(questionID).then((response: any) => {
                                        if (response.status == 200) {
                                            let elementInfo = (element as HTMLInputElement);
                                            if (elementInfo.type == "radio") {
                                                elementInfo.click();
                                                clickCount++;
                                            } else if (elementInfo.type == "checkbox") {
                                                elementInfo.checked = true
                                                clickCount++;
                                            }
                                        } else {
                                            console.log(response.status);
                                        }
                                        resolve();
                                    });
                                });
                            });
                            // Wait for all promises to resolve before logging the count
                            Promise.all(clickPromises).then(() => {
                                if (clickCount > 0) {
                                    let SF = getStageFrame();
                                    if (SF && SF.contentWindow) {
                                        // We must have clicked something, we can run API.Frame.Check() now.
                                        (<any>SF.contentWindow).API.Frame.check();
                                    }
        
                                }
                            });
                        } else {
                            let selectEleList = iframePreview.contentDocument.getElementsByTagName("select");
                            let optionEleList: HTMLCollectionOf<HTMLOptionElement>;
                            if (selectEleList.length > 0) {
                                let selectElePromises = Array.from(selectEleList).map((element: Element) => {
                                    return new Promise<void>((resolve) => {
                                        // Get all option elements under the select element
                                        optionEleList = element.getElementsByTagName("option");
                                        if (optionEleList) {
                                            Array.from(optionEleList).forEach(element => {
                                                // Check if the option is correct
                                                let questionID = element.id;
                                                if (questionID) {
                                                    getAssignmentAnswerFromDB(questionID).then((response: any) => {
                                                        let jsonResponse = JSON.parse(response.responseText);
                                                        if (response.status == 200) {
                                                          // Select the correct answer
                                                          element.selected = true;
                                                          clickCount++;
                                                        } else {
                                                            console.log(response.status);
                                                        }
                                                        resolve();
                                                    }); 
                                                }
                                            });
                                        }
                                    });
                                });
                                Promise.all(selectElePromises).then(() => {
                                    if (clickCount > 0) {
                                        let SF = getStageFrame();
                                            // We must have clicked something, we can run API.Frame.Check() now.
                                            setTimeout(() => {
                                                if (SF && SF.contentWindow) {
                                                (<any>SF.contentWindow).API.Frame.check();
                                                }
                                            }, 400);
                                    }
                                });
                            } else {
                                let inputBoxEleList = iframePreview.contentDocument.querySelectorAll("input[type='text']")
                                if (inputBoxEleList) {
                                    const textItemPromises = Array.from(inputBoxEleList).map((element: Element) => {
                                        return new Promise<void>((resolve) => {
                                            let questionID = element.id;
                                            if (questionID) {
                                                getAssignmentAnswerFromDB(questionID, true).then((response: any) => {
                                                    let jsonResponse = JSON.parse(response.responseText);
                                                    if (response.status == 200) {
                                                        // Select the correct answer
                                                        (element as HTMLInputElement).value = jsonResponse.optional_data;
                                                        clickCount++;
                                                    } else {
                                                        console.log(response.finalUrl);
                                                    }
                                                    resolve();
                                                }); 
                                            }
                                        });
                                    });
                                    
                                    Promise.all(textItemPromises).then(() => {
                                        if (clickCount > 0) {
                                            let SF = getStageFrame();
                                            if (SF && SF.contentWindow) {
                                                // We must have clicked something, we can run API.Frame.Check() now.
                                                (<any>SF.contentWindow).API.Frame.check();
                                            }
                
                                        }
                                    });
                                } else {
                                    let qid = iframePreview.contentDocument.querySelectorAll("div[qid]");
                                    if (qid) {
                                        const textItemPromises = Array.from(iframePreview.contentDocument.getElementsByTagName("input")).map((element: Element) => {
                                            return new Promise<void>((resolve) => {
                                                let questionID = element.id;
                                                if (questionID) {
                                                    getAssignmentAnswerFromDB(questionID).then((response: any) => {
                                                        let jsonResponse = JSON.parse(response.responseText);
                                                        if (response.status == 200) {
                                                            // Select the correct answer
                                                            (element as HTMLInputElement).value = jsonResponse.optional_data;
                                                            clickCount++;
                                                        } else {
                                                            console.log(response.finalUrl);
                                                        }
                                                        resolve();
                                                    }); 
                                                }
                                            });
                                        });
                                        Promise.all(textItemPromises).then(() => {
                                            if (clickCount > 0) {
                                                let SF = getStageFrame();
                                                if (SF && SF.contentWindow) {
                                                    // We must have clicked something, we can run API.Frame.Check() now.
                                                    (<any>SF.contentWindow).API.Frame.check();
                                                }
                    
                                            }
                                        });
                                    }
                                }
                    }
                            // let textInputEleList = iframePreview.contentDocument.getElementsByTagName("input");
                            // if (textInputEleList) {
                            //     Array.from(textInputEleList).forEach(element => {
                            //         let questionID = element.id;
                            //         if (questionID) {
                            //             getAssignmentAnswerFromDB(questionID).then((response: any) => {
                            //                 let jsonResponse = JSON.parse(response.responseText);
                            //                 if (response.status == 200) {
                            //                     // Select the correct answer
                            //                     element.value = jsonResponse.optional_data;
                            //                     clickCount++;
                            //                 } else {
                            //                     console.log(response.finalUrl);
                            //                 }
                            //             }); 
                            //         }
                            //     });
                            // }
                        }
                    }
                }
            }
        }
    }
  }


let interval: NodeJS.Timeout | null;

function activateAutomaticAssignments() {
    if (interval) {
        return;
    }

    let stageFrame = getStageFrame();

    if (stageFrame && stageFrame.contentDocument && stageFrame.contentDocument.readyState) {
        if (stageFrame.contentDocument.readyState == "complete") {
            interval = setInterval(() => {
                let activityTitleEle = document.getElementById("activity-title")
                if (activityTitleEle) {
                    let activityTitle = activityTitleEle.innerText.toLowerCase().trim().replace(" ", "");
                    if (activityTitle == "assignment") {
                        attemptToAnswerQuestion();
                    }
                }
            }, 2000)
        }
    } else {
        // Recursively try again in 500ms.
        setTimeout(() => {
            activateAutomaticAssignments();
        }, 500)
    }

}

function deactivateAutomaticAssignments() {
    if (interval) {
        clearInterval(interval);
    }
}

export const automaticAssignments: Module = {
    "name": "automaticAssignments",
    "activate": activateAutomaticAssignments,
    "deactivate": deactivateAutomaticAssignments,
}

export default automaticAssignments;