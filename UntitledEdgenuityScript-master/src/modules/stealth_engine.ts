/*  -----------------------------------------------------------------------------------------------

    -- stealh_engine.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This module allows you to enter stealth mode, which hides UES's presence on the page.
    This allows you to use UES without your teacher knowing.

    ----------------------------------------------------------------------------------------------- */
import moduleList, { Module } from "./modules";
import module_manager from "../module_manager";
import { NO_DEACTIVATE } from "./globals";

declare function GM_getValue(name: string, defaultValue?: any): any;
declare function GM_setValue(name: string, value: any): void;

let stealthModeModuleState: Array<string> = [];

function registerStealthKeybind() {
    return new Promise((resolve) => {
        if (window == window.top) {
            // Keybind will be CTRL + M
            // Now we register an event listener for the keydown event
            document.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "m" && event.ctrlKey) {
                    // The keybind was pressed
                    let newStatus = toggleStealthStatus();
                    toggleStealthMode(newStatus);
                }
            });
            toggleStealthMode(GM_getValue("ues-stealth-mode"));
            resolve(true);
    }});
}

function toggleStealthStatus() {
    let stealthModeStatus = GM_getValue("ues-stealth-mode");
    if (stealthModeStatus === "enabled") {
        GM_setValue("ues-stealth-mode", "disabled");
    } else {
        GM_setValue("ues-stealth-mode", "enabled");
    }
    return GM_getValue("ues-stealth-mode");
}

function toggleStealthMode(newStatus: string) {
    if (newStatus === "enabled") {
        // Stealth mode is enabled
        // Exit stealth mode
        exitStealthMode();
    } else {
        // Stealth mode is disabled
        // Enter stealth mode
        enterStealthMode();
    }
}

/*  -----------------------------------------------------------------------------------------------
    Breakdown of UES's Stealth Mode:
    -- Checks if the user is in stealth mode
        -- If the user is in stealth mode, UES will:
            -- Restore modules to their original state
            -- Show the UES UI
        -- If the user is not in stealth mode, UES will:
            -- Save a copy of the current state of the modules
            -- Hide the UES UI
            -- Deactivate all modules
    -- The user will be able to reactive the modules by pressing the keybind again.
    -- Ideally the user will be able to set a password to enter/exit stealth mode, but this is not a priority!
    -- I would like to add a feature that allows the user to set a custom keybind for entering/exiting stealth mode, but this might not even be possible.
    ----------------------------------------------------------------------------------------------- */
async function saveModuleState() {
    let activatedModules = module_manager.getActivatedModules();
    stealthModeModuleState = activatedModules;
}

async function loadModuleState() {
    stealthModeModuleState.forEach((module: string) => {
        module_manager.activateModule(module);
    });
}

async function enterStealthMode() {
    saveModuleState();
    stealthModeHideUI();
    for (let module in moduleList) {
        module_manager.deactivateModule(module);
    }
}

async function exitStealthMode() {
    loadModuleState();
    stealthModeShowUI();
}

function stealthModeHideUI() {
    let draggableUI = document.getElementById("ues-draggable-ui");
    if (draggableUI) {
        draggableUI.style.opacity = "0"
        draggableUI.style.pointerEvents = "none";
    }
}

function stealthModeShowUI () {
    let draggableUI = document.getElementById("ues-draggable-ui");
    if (draggableUI) {
        draggableUI.style.opacity = "1"
        draggableUI.style.pointerEvents = "all";
    }
}

export const StealthEngine: Module = {
    name: "StealthEngine",
    activate: registerStealthKeybind,
    deactivate: NO_DEACTIVATE,
}

export default StealthEngine;