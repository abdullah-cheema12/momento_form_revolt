/*  -----------------------------------------------------------------------------------------------

    -- show_hidden_columns.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module shows hidden columns in an assignment. 
    This module is force enabled.

    ----------------------------------------------------------------------------------------------- */

import { NO_DEACTIVATE } from "./globals";
import { Module } from "./modules";

function showHiddenColumns() {
    const iframes = document.querySelectorAll("iframe");

    for (let i = 0; i < iframes.length; i++) {
        const innerIframes = iframes[i].contentDocument?.querySelectorAll("iframe");
        if (innerIframes === null || innerIframes === undefined) {
            continue;
        }
        for (let j = 0; j < (innerIframes.length ?? 0); j++) {
            if (innerIframes[j] !== null && innerIframes[j].contentDocument !== null && innerIframes[j].contentDocument !== undefined) { 
                const rightColumn = innerIframes[j].contentDocument?.querySelector(".right-column");
                const leftColumn = innerIframes[j].contentDocument?.querySelector(".left-column");
    
                if (rightColumn) {
                    rightColumn.children[0].removeAttribute("style");
                }
    
                if (leftColumn) {
                    leftColumn.children[0].removeAttribute("style");
                }
    
                const hiddenDivs = innerIframes[j].contentDocument!.querySelectorAll('div[fstack][style="display:none;"]');
    
                for (let k = 0; k < hiddenDivs.length; k++) {
                    hiddenDivs[k].removeAttribute("style");
                }
            }
        }
    }
}

export const showHiddenColumnsModule: Module = {
    name: "showHiddenColumns",
    activate: showHiddenColumns,
    deactivate: NO_DEACTIVATE,
};

export default showHiddenColumnsModule;