/*  -----------------------------------------------------------------------------------------------

    -- get_stage_frame.ts
    Copyright (c) 2023 Revolt.

    Description:
    This is a utility function that returns the stage frame.
    This just gets rid of a lot of the repetitive code in the modules.

    ----------------------------------------------------------------------------------------------- */

export function getStageFrame(): HTMLIFrameElement | null {
    if (document.getElementById("stageFrame") === null) {
        return null;
    }
    return <HTMLIFrameElement>(document.getElementById("stageFrame"));
}

export function getIframePreview(): HTMLIFrameElement | null {
    let stageFrame = getStageFrame();
    if (stageFrame !== null && stageFrame.contentWindow !== null) {
        return stageFrame.contentWindow.document.getElementById("iFramePreview") as HTMLIFrameElement
    } else {
        return null;
    }
}