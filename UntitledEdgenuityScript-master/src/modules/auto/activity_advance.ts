/*  -----------------------------------------------------------------------------------------------

    -- activity_advance.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module automatically advances the activity when it is complete.
    This module is not force enabled.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "../modules";
import { getIframePreview, getStageFrame } from "../utilities/get_stage_frame";

let interval: NodeJS.Timeout;

function activityAdvance() {
    interval = setInterval(() => {
        const activityTitleEle = document.getElementById("activity-title")
        if (activityTitleEle !== null) {
            let activityTitle = activityTitleEle.innerText.toLowerCase().trim().replace(" ", "");
            const goRightButton = document.querySelector(".footnav.goRight") as HTMLButtonElement;
            if (goRightButton && !goRightButton.classList.contains("disabled")) {
                goRightButton.click();
            }
            const stageFrame = getStageFrame();
            if (stageFrame !== null) {
                let SFContentWindow = stageFrame.contentWindow;
                if (activityTitle != "assignment") {
                    if (SFContentWindow !== null && SFContentWindow !== undefined) {
                        let iframepreview = SFContentWindow.document.getElementById("iFramePreview") as HTMLIFrameElement;
                        if (iframepreview === null || iframepreview === undefined) return;
                        let doneStartList = iframepreview.contentWindow?.document.getElementsByClassName("done-start");
                        if (doneStartList && doneStartList.length > 0) {
                            let doneStart = doneStartList[0] as HTMLButtonElement;
                            doneStart.click();
                        }
                    }
                } 
                if ((<any>SFContentWindow).API) {
                    (<any>SFContentWindow).API.FrameChain.nextFrame();
                }
            }
        }
    }, 1500);
}

function stopActivityAdvance() {
    clearInterval(interval);
}

export const activityAdvanceModule: Module = {
    name: "activityAdvance",
    activate: activityAdvance,
    deactivate: stopActivityAdvance,
};

export default activityAdvanceModule;