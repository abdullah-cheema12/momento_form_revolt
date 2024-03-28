/*  -----------------------------------------------------------------------------------------------

    -- prevent_logout.ts
    Copyright (c) 2023 Revolt.

    Description:
    This module prevents the user from being logged out by checking if the user is about to be logged out and prevent it.
    This module is force enabled.

    ----------------------------------------------------------------------------------------------- */

import { NO_DEACTIVATE } from "./globals";
import { Module } from "./modules";


let interval: NodeJS.Timeout | null = null;

function prevent_logout() {
    interval = setInterval(() => {
        const timerStayButton = document.getElementById("timerStay");
        if (timerStayButton && timerStayButton.clientWidth > 0) {
            timerStayButton.click();
        }
    }, 3000);
}
export const preventLogout: Module = {
    name: "preventLogout",
    activate: prevent_logout,
    deactivate: NO_DEACTIVATE,
};

export default preventLogout;