/*  -----------------------------------------------------------------------------------------------

    -- bootstrap.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This file is responsible for bootstrapping Revolt, and loading all of the modules.
    This is an abstraction on top of index.ts, which is the entry point for the userscript.

    ----------------------------------------------------------------------------------------------- */

import modules, { Module } from "./modules/modules";
import module_manager from "./module_manager";
import { setTheme } from "./toggle_theme";
import { initDragElement } from "./draggable_ui";
import { registerToggleThemeListener } from "./toggle_theme";
import { css } from "./css"

declare function GM_getValue(name: string, defaultValue?: any): any;
declare function GM_setValue(name: string, value: any): void;

async function cssInject(css: string) {
    return new Promise((resolve) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        resolve(true);
    });
}



export async function bootstrap() {
    // Load the theme
    let theme = GM_getValue("ues-theme");
    if (theme == undefined) {
        GM_setValue("ues-theme", "light");
    }
    await initUI();
    registerToggleThemeListener();

    // Activate modules
    module_manager.activateSavedModules();
}

function setExpiryDate() {
    const expiryTimestamp = window.expiryTimestamp * 1000;
    if (Number.isNaN(expiryTimestamp)) return "1/1/9999"
    const date = new Date(expiryTimestamp);
    return date.toLocaleDateString();
}

async function initUI() {
    // Initalize the UI for UES
    await cssInject(css);
    setTheme();
    const draggableUI = document.createElement('div');
    draggableUI.id = 'ues-draggable-ui';
    draggableUI.innerHTML = `
        <div id="ues-header-draggable-ui">
        <img class="revolt-logo" src="https://cdn.discordapp.com/icons/1155664740010442852/75d61578b9e4ab4a8619de95d328c7be.webp" />
            <div class="revolt-header-text-container">
                <span class="revolt-title" style="font-size: 18px;">Revolt</span>
                <span class="revolt-key-expiration" style="font-size: 14px;">Your key expires on <span id="revolt-expiry-date" class="revolt-key-expiration-date"></span></span>
            </div>
        </div>
        <div id="ues-content-draggable-ui">
            <div class="modules-container">
                <div class="ues-sm-button" data-state="deactivated" id="auto-assignment">Auto Assignments</div>
                <div class="ues-sm-button" data-state="deactivated" id="auto-exam">Auto Exams</div>
                <div class="ues-sm-button" data-state="deactivated" id="auto-advance">Auto Advance</div>
                <div class="ues-sm-button" data-state="deactivated" id="auto-instruction">Auto Instructions</div>
                <div class="ues-sm-container" id="auto-submit-delay">
                    <label class="ues-sm-label">Submit Delay</label>
                    <input class="ues-sm-input" id="submit-delay"></input>
                </div>
                <div class="ues-sm-button" data-state="deactivated" id="auto-vocab">Auto Vocab</div>
                <div class="ues-sm-button" data-state="deactivated" id="auto-labs">Auto Labs</div>
                <div class="ues-sm-button" data-state="deactivated" id="ask-brainly">Search with Brainly</div>
                <div class="ues-sm-button" data-state="deactivated" id="frame-unlocker">Frame Unlocker</div>
            </div>
            <div class="bottom-container">
            <div class="themes-container">
                <div class="ues-bottom-btn selected" id="ues-toggle-theme-light">
                    <i class="bx bxs-sun theme-icon"></i> <span class="bottom-btn-text">Light Mode</span>
                </div>
                <div class="ues-bottom-btn" id="ues-toggle-theme-dark"><i class="bx bxs-moon theme-icon"></i> <span class="bottom-btn-text">Dark Mode</span></div>
            </div>
            <div class="link-container">
                <a href="https://discord.gg/revoltedge" target="_blank" rel="noreferrer noopener" class="bx bxl-discord-alt bottom-link"></a>
                <a href="#" target="_blank" rel="noreferrer noopener" class="bx bxs-home bottom-link"></a>
                <a href="https://github.com/kaidadnd/Revolt/" target="_blank" rel="noreferrer noopener" class="bx bxl-github bottom-link"></a>
            </div>
            </div>
        </div>
    `;
    document.body.appendChild(draggableUI);
    initDragElement(draggableUI);

    const expiryDateEle = document.getElementById('revolt-expiry-date');
    if (expiryDateEle) expiryDateEle.innerText = setExpiryDate();

    const lightThemeButton = document.getElementById('ues-toggle-theme-light');
    const darkThemeButton = document.getElementById('ues-toggle-theme-dark');

    lightThemeButton?.addEventListener('click', () => {
        swapClassList(darkThemeButton, lightThemeButton, 'selected');
        GM_setValue('ues-theme', 'light');
        setTheme();
    });

    darkThemeButton?.addEventListener('click', () => {
        swapClassList(lightThemeButton, darkThemeButton, 'selected');
        GM_setValue('ues-theme', 'dark');
        setTheme();
    });

    GM_getValue('ues-theme') === 'dark' ? darkThemeButton?.click() : lightThemeButton?.click();

    function swapClassList(element1: HTMLElement | null, element2: HTMLElement | null, classToSwap: string) {
        if (!element1 || !element2) return;
        element1.classList.remove(classToSwap);
        element2.classList.add(classToSwap);
    }

    // Add event listeners
    Array.from(document.getElementsByClassName('ues-sm-button')).forEach((element: Element) => {
        element.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const id = target.id;
            if (target.getAttribute('data-state') === 'deactivated') {
                // Activate module
                target.setAttribute('data-state', 'activated');
                target.classList.add("selected");
                module_manager.activateModule(id);
            } else {
                // Deactivate module
                target.setAttribute('data-state', 'deactivated');
                target.classList.remove("selected");
                module_manager.deactivateModule(id);
            }
        });
    });

    Array.from(document.getElementsByClassName('ues-sm-input')).forEach((element: Element) => {
        element.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            GM_setValue(target.id, target.value);
        });

        const savedValue = GM_getValue((element as HTMLInputElement).id);
        if (savedValue) {
            (element as HTMLInputElement).value = savedValue;
        }
    });
}