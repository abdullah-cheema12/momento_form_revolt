/*  -----------------------------------------------------------------------------------------------

    -- automatic-instruction.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This module attempts to automate many kinds of instruction activities.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "../modules";

let interval: NodeJS.Timeout | null = null;

function automateInstructions() {
    const ungradedActivities = ["Instruction", "Warm-Up", "Summary", "Lecture"];
    interval = setInterval(() => {
        let activityTitleEle = document.getElementById("activity-title")
        if (!activityTitleEle) return;
        let activityTitle = activityTitleEle.innerText;
        const stageFrame = document.querySelector("iframe#stageFrame") as HTMLIFrameElement;
        if (ungradedActivities.includes(activityTitle) && stageFrame) {
            const form = stageFrame.contentDocument!.querySelector("form");
            const answerButtons = form ? (form.querySelectorAll(".answer-choice-button") as unknown as HTMLButtonElement[]) : [];
            if (answerButtons.length > 0) {
                answerButtons[Math.floor(Math.random() * answerButtons.length)].click();
            } else {
                const innerFrame = stageFrame.contentDocument!.querySelector("iframe");
                if (innerFrame == null) {
                    return;
                }
                let innerAnswerButtons: HTMLButtonElement[] = innerFrame.contentDocument!.querySelectorAll(".answer-choice-button") as unknown as HTMLButtonElement[];
                // if (innerFrame && innerFrame.contentDocument && innerFrame.contentDocument.querySelector(".answer-choice-button") === null) {
                //     innerAnswerButtons = innerFrame ? (innerFrame.contentDocument.querySelectorAll(".answer-choice-button") as unknown as HTMLButtonElement[]) : [];
                // }
                if (innerAnswerButtons.length > 0) {
                    innerAnswerButtons[Math.floor(Math.random() * innerAnswerButtons.length)].click();
                }
            }
    
            const checkButton = stageFrame.contentDocument!.querySelector("#btnCheck") as HTMLButtonElement;
            const doneButton = stageFrame.contentDocument!.querySelector('[title="done"]') as HTMLButtonElement;
    
            if (doneButton) {
                doneButton.click();
            }
    
            if (checkButton) {
                checkButton.click();
            }
        }
    }, 500)
}

function activate() {
    automateInstructions();
}

export const automaticInstruction: Module = {
    name: "automaticInstruction",
    activate: activate,
    deactivate: () => {
        if (interval) {
            clearInterval(interval);
        }
    },
}

export default automaticInstruction;