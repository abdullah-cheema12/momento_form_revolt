/*  -----------------------------------------------------------------------------------------------

    -- automatic_vocab.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This module attempts to automatically fills in the answers for the vocabulary activity.
    This module is not force enabled, but automatically activated when "Auto Answers" is enabled.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "../modules";
import { determineActivityType } from "../utilities/determine_activity_type";

let interval: NodeJS.Timeout | null = null;
let interval2: NodeJS.Timeout | null = null;

function deactivateAutomaticVocab() {
    if (interval) {
        clearTimeout(interval);
    }
    if (interval2) {
        clearTimeout(interval2);
    }
}

function fillInVocabularyAnswers() {
    setTimeout(() => {
        const activityTitleEle = document.getElementById("activity-title")
        let activityTitle = determineActivityType();
        const stageFrame = document.getElementById("stageFrame");
    
        if (activityTitle === "vocabulary" && stageFrame) {
            interval = setInterval(() => {
                const activityTitle = document.getElementById("activity-title");
    
                if (activityTitle && activityTitle.textContent === "Vocabulary") {
                    const stageFrame = (document.querySelector("#stageFrame") as HTMLIFrameElement).contentDocument;
                    if (stageFrame == null) {
                        throw new Error("stageFrame is null")
                    }
                    const wordBackground = stageFrame.querySelector(".word-background") as HTMLInputElement;
                    const wordTextbox = stageFrame.querySelector(".word-textbox") as HTMLInputElement;
                    const nextButton = stageFrame.querySelector(".uibtn.uibtn-blue.uibtn-arrow-next") as HTMLButtonElement;
    
                    if (nextButton && wordBackground && wordTextbox) {
                        const word = wordBackground.value;
                        wordTextbox.value = word;
    
                        const keyupEvent = new Event("keyup");
                        wordTextbox.dispatchEvent(keyupEvent);
    
                        nextButton.click();
    
                        const playButtons = stageFrame.querySelectorAll(".playbutton.vocab-play") as unknown as HTMLButtonElement[];
                        if (playButtons.length > 0) {
                            playButtons[0].click();
                            playButtons[1].click();
                        }
    
                        setTimeout(() => {
                            nextButton.click();
                        }, 1500);
                    }
                }
            }, 1000);
        }
    }, 1000)
}

export const automaticVocabModule: Module = {
    name: "automaticVocab",
    activate: fillInVocabularyAnswers,
    deactivate: deactivateAutomaticVocab,
};

export default automaticVocabModule;