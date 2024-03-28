/*  -----------------------------------------------------------------------------------------------

    -- remove_intro_screen.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module removes the intro screens, which allows you to start working without waiting for the voiceover to finish.
    This module is force enabled.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "./modules";

function removeIntroScreens() {
    const stageFrame = <HTMLIFrameElement>document.getElementById("stageFrame");

    if (stageFrame) {
        stageFrame.addEventListener("load", () => {
            if (stageFrame.contentDocument !== null) {
                const invisODiv = stageFrame.contentDocument.querySelector("#invis-o-div");

                if (invisODiv) {
                    invisODiv.remove();
                }
            }
            let main_area = document.getElementById("main_area");
            if (main_area && main_area.getElementsByTagName("video")[0] !== undefined) {
                let vid = main_area.getElementsByTagName("video")[0];
                vid.muted = true;
                vid.addEventListener("ended", () => { (<any>stageFrame.contentDocument).API.FrameChain.nextFrame() })
                if (vid.paused) { vid.play() };
            }
        });
    }
}

export const removeIntroScreensModule: Module = {
    name: "removeIntroScreens",
    activate: removeIntroScreens,
    deactivate: () => { },
};

export default removeIntroScreensModule;