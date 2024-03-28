/*  -----------------------------------------------------------------------------------------------

    -- module_manager.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This file manages all of the modules in UES.

    ----------------------------------------------------------------------------------------------- */

import modules from "./modules/modules"
import UESLogger from "./logging";
declare function GM_getValue(name: string, defaultValue?: any): any;
declare function GM_setValue(name: string, value: any): void;

let activatedModules: string[] = [];

function getSavedModules() {
    return GM_getValue("activatedModules");
}

function getActivatedModules(): string[] {
    return activatedModules;
}

function activateSavedModules() {
    let savedModules = getSavedModules();
    savedModules.forEach((module: string) => {
        activateModule(module);
    });
}

function activateModule(moduleID: string) {
    switch (moduleID) {
        case "auto-assignment":
            modules.automaticAssignments.activate();
            break;
        case "auto-exam":
            modules.automaticExam.activate();
            break;
        case "auto-advance":
            modules.activityAdvance.activate();
            break;
        case "auto-vocab":
            modules.automaticVocab.activate();
            break;
        case "auto-labs":
            modules.automaticLab.activate();
            break;
        case "auto-instruction":
            modules.automaticInstruction.activate();
            break;
        case "ask-brainly":
            modules.askBrainlyButton.activate();
            break;
        case "auto-journal":
            modules.automaticJournalModule.activate();
            break;
        case "frame-unlocker":
            modules.removeFrameRestrict.activate();
            break;
        case "brainly":
            modules.UnlimitedBrainly.activate();
        default:
            break;
    }
    UESLogger.log("Activated Module: " + moduleID)
    const element = document.getElementById(moduleID);
    if (element) {
        element.setAttribute('data-state', 'activated');
        element.classList.add("selected");
    }
    if (activatedModules.includes(moduleID)) return;
    activatedModules.push(moduleID);
    GM_setValue("activatedModules", activatedModules);
}

function deactivateModule(moduleID: string) {
    switch (moduleID) {
        case "auto-assignment":
            modules.automaticAssignments.deactivate();
            break;
        case "auto-exam":
            modules.automaticExam.deactivate();
            break;
        case "auto-advance":
            modules.activityAdvance.deactivate();
            break;
        case "auto-vocab":
            modules.automaticVocab.deactivate();
            break;
        case "auto-labs":
            modules.automaticLab.deactivate();
            break;
        case "auto-instruction":
            modules.automaticInstruction.deactivate();
            break;
        case "ask-brainly":
            modules.askBrainlyButton.deactivate();
            break;
        case "auto-journal":
            modules.automaticJournalModule.deactivate();
            break;
        case "frame-unlocker":
            modules.removeFrameRestrict.deactivate();
            break;
        default:
            break;
    }

    UESLogger.log("Deactivated Module: " + moduleID)
    const element = document.getElementById(moduleID);
    if (element) {
        element.setAttribute('data-state', 'deactivated');
        element.style.removeProperty('background-color');
    }

    // Remove the module from the activated modules list.
    activatedModules = activatedModules.filter((module) => module !== moduleID);
    GM_setValue("activatedModules", activatedModules);
}

document.getElementById("stageFrame")?.addEventListener("load", () => {
    modules.showHiddenColumns.activate();
    modules.removeIntroScreensModule.activate();
});

export default {
    activateModule,
    deactivateModule,
    getActivatedModules,
    getSavedModules,
    activateSavedModules,
};
