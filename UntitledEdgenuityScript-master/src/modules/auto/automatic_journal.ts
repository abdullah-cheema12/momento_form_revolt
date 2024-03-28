import UESLogger from "../../logging";
import { Module } from "../modules";
import { getActivityTitle } from "../utilities/get_activity_title";
import { getStageFrame } from "../utilities/get_stage_frame";

let interval: NodeJS.Timeout | null;

function stopAutomaticJournalModule() {
    if (interval) {
        clearInterval(interval);
    }
}

function startAutomaticJournalModule() {
    interval = setInterval(() => {
        let activityTitle = getActivityTitle();
        if (activityTitle == "journalactivity") {
            let stageFrame = getStageFrame();
            if (stageFrame && stageFrame.contentDocument) {
                let journalTitleEle = stageFrame.contentDocument.getElementsByClassName("journal-question journal-prompt-condensed")[0] as HTMLDivElement;
                let journalTitle = ""
                if (journalTitleEle) {
                    journalTitle = journalTitleEle.innerText;
                }
                let activityFrame = stageFrame.contentDocument.getElementsByClassName("cke_wysiwyg_frame cke_reset") as HTMLCollectionOf<HTMLIFrameElement>;
                if (activityFrame.length > 0) {
                    let activityFrameDocument = activityFrame[0].contentDocument;
                    if (activityFrameDocument) {
                        let activityFrameBody = activityFrameDocument.getElementsByTagName("body")[0];
                        if (activityFrameBody) {
                            activityFrameBody.innerHTML = `${journalTitle}`;
                            activityFrameBody.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 32 }));
                        }
                        let submitBtn = stageFrame.contentDocument.getElementById('SubmitButton')
                        console.log(submitBtn)
                        if (submitBtn) {
                            submitBtn.removeAttribute('disabled')
                            submitBtn.click();
                        }
                    }
                }

            }
        }
    }, 2000)
}


export const automaticJournalModule: Module = {
    name: "automaticJournal",
    activate: startAutomaticJournalModule,
    deactivate: stopAutomaticJournalModule,
};

export default automaticJournalModule;