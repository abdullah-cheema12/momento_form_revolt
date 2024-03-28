/*  -----------------------------------------------------------------------------------------------

    -- ask_brainly_button.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module adds a button to the Edgenuity UI that allows the user to find the answer to a question on Brainly.
    This module is NOT force enabled.

    ----------------------------------------------------------------------------------------------- */

import { Module } from "./modules";
import { getIframePreview, getStageFrame } from "./utilities/get_stage_frame";

const selectors = [
    "body > div.content > div.right-column > div > div:nth-child(1) > div > div:nth-child(1) > p",
    "body > div.content > div.left-column > div > p",
    "body > div.content > div > div:nth-child(1) > div > div:nth-child(2) > p",
    "body > div.content",
    "body > div.content > div > div:nth-child(1) > div > div:nth-child(2)",
    "body > div.content > div > div:nth-child(1) > div > div:nth-child(2) > p",
    "div[id^='q_'] > div > div:nth-child(3) > div:nth-child(1) > p"
];

function addAskBrainlyBtn() {
    setTimeout(() => {
        let iframepreview = getIframePreview();
        let stageFrame = getStageFrame();
        let firstMatch;
        selectors.forEach((selector) => {
            if (iframepreview && iframepreview.contentDocument) {
            let result = iframepreview.contentDocument.querySelector(selector);
                if (result) {
                    firstMatch = selector;
                    return;
                }
            }
        })
        
        if (firstMatch && stageFrame && stageFrame.contentDocument) {
            const button = createButton();
            addClickEvent(button, firstMatch);
            addStyles();
        }
    }, 2000);

}

function addStyles() {
    let SF = getStageFrame();
    if (SF && SF.contentDocument) {
        const style = SF.contentDocument.createElement('style');
        style.innerHTML = `
            .sg-button {
                position: fixed;
                top: 95%;
                left: 10.5%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                color: #000;
                height: 35px;
                border: 2px solid #000;
                border-radius: 20px;
                white-space: nowrap;
                text-decoration: none;
                font-size: 15px;
                font-weight: bold;
                text-transform: uppercase;
                padding: 0 20px;
                cursor: pointer;
                transition: background-color 80ms cubic-bezier(0.3, 0, 1, 0.8);
            }
    
            .sg-button:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
    
            .sg-button:active {
                background-color: rgba(0, 0, 0, 0.2);
            }
    
            .sg-button img {
                margin-right: 10px;
                height: 20px;
            }
        `;
        SF.contentDocument.head.appendChild(style);
    }
}


function createButton() {
    let SF = getStageFrame();
    if (SF && SF.contentDocument) {
        const button = SF.contentDocument.createElement('button');
        button.className = 'sg-button';
        button.innerHTML = '<img src="https://cdn.discordapp.com/attachments/1166905447710732299/1186281208674521098/image.png?ex=6592ad78&is=65803878&hm=837a9aa277b9d63abb9b825d2768ef185bf2af1714e7702e6e2b234f20394f6b" alt="Brainly Logo">Ask Brainly';
        SF.contentDocument.body.appendChild(button);
        return button;
    }
}

function addClickEvent(button: any, firstMatch: any) {
    let iframepreview = getIframePreview();
    button.addEventListener('click', function () {
        if (iframepreview && iframepreview.contentDocument) {
        const selectedElement = iframepreview.contentDocument.querySelector(firstMatch);
        const selectedText = selectedElement ? selectedElement.textContent : '';
        const encodedText = encodeURIComponent(selectedText);
        window.open(`https://brainly.com/app/ask?q=${encodedText}`, '_blank');
        }
    });
}



export const askBrainlyButton: Module = {
    name: 'Ask Brainly Button',
    activate: addAskBrainlyBtn,
    deactivate: () => {
        let SF = getStageFrame();
        if (SF && SF.contentDocument) {
            const button = document.querySelector('.sg-button');
            if (button) {
                button.remove();
            }
        }
    }
}

export default askBrainlyButton;