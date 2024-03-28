import { NO_DEACTIVATE } from "./globals";
import { Module } from "./modules";
import { getStageFrame } from "./utilities/get_stage_frame";

function muteSite() {
    setInterval(() => {
        let SF = getStageFrame();
        if (SF && SF.contentDocument) {
            let video = SF.contentDocument.querySelectorAll("video");
            if (video) {
                video.forEach((vid) => {
                    vid.muted = true;
                })
            }
        }
    }, 2000)
}

export const MuteSite: Module = {
    name: "MuteSite",
    activate: muteSite,
    deactivate: NO_DEACTIVATE,
}

export default MuteSite;