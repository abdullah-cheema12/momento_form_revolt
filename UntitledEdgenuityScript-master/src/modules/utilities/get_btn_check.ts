import { getStageFrame } from "./get_stage_frame";

export function getBtnCheck() {
    let stageFrame = getStageFrame();
    if (stageFrame !== null) {
        if (stageFrame.contentDocument !== null) {
            let btnCheck = stageFrame.contentDocument.getElementById("btnCheck");
            return btnCheck;
        }
    }
}