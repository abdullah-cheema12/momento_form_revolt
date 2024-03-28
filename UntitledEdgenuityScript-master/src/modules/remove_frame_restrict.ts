/*  -----------------------------------------------------------------------------------------------

    -- remove_frame_restrict.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module removes the restrictions on frame navigation.
    This module is NOT force enabled.

    ----------------------------------------------------------------------------------------------- */

import { StageFrame } from "./globals";
import { Module } from "./modules";

let interval: NodeJS.Timeout;

function removeFrameRestrictions() {
    interval = setInterval(() => {
        const stageFrame = document.getElementById("stageFrame") as HTMLIFrameElement;

        if (stageFrame) {
            const contentWindow = stageFrame.contentWindow as StageFrame.contentWindow | null;
            if (contentWindow && contentWindow.API && contentWindow.API.E2020) {
                (<any>stageFrame.contentWindow).API.E2020.freeMovement = true;
            }
        }
    }, 1500)

}

function deactivate() {
    if (interval) {
        clearInterval(interval);
    }

}

export const removeFrameRestrictModule: Module = {
    name: "removeFrameRestrict",
    activate: removeFrameRestrictions,
    deactivate: deactivate,
};

export default removeFrameRestrictModule;