/*  -----------------------------------------------------------------------------------------------

    -- automatic-lab.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module automatically completes lab activites. 
    This module is not force enabled, but automatically activated when "Auto Answers" is enabled.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "../modules";

let interval: NodeJS.Timeout;

function automaticallyAdvanceLab() {
    const activityTitleEle = document.getElementById("activity-title")
    if (!activityTitleEle) return;
    const activityTitle = activityTitleEle.innerText;
    // This one is a doozy lol.
    const stageFrame: Document = (document.getElementById("stageFrame") as HTMLIFrameElement).contentWindow!.document;

    if (activityTitle === "Virtual Lab") {
        setInterval(() => {
            stageFrame.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 32 }));
            stageFrame.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 32 }));
        }, 300);
    }
}

function activate() {
    automaticallyAdvanceLab();
}

function deactivate() {
    if (interval) {
        clearInterval(interval);
    }
}

export const automaticLab: Module = {
    name: "automaticLab",
    activate: activate,
    deactivate: deactivate,
};

export default automaticLab;