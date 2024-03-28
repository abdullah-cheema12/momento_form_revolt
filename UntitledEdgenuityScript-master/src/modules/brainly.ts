import { NO_DEACTIVATE } from "./globals";
import { Module } from "./modules";

function brainlyLockPick() {
    if (window.location.href.includes("https://brainly.com")) {
    let set_remove = false;
    let cleared_cookies = false;
    if (!set_remove) {
        setInterval(() => {
            let credentialContainer = document.getElementById("credential_picker_container")
            if (credentialContainer !== null) {
                credentialContainer.remove();
            }
            const brn_qpage = document.getElementsByClassName("brn-qpage-layout__right")[0];
            const sg_space_ignore = document.getElementsByClassName("sg-space-ignore")[0];
            const js_dialog_overlay = document.getElementsByClassName("js-dialog sg-dialog__overlay sg-dialog__overlay--size-l sg-dialog__overlay--scroll sg-dialog__overlay--open")[0];
            if (brn_qpage) brn_qpage.remove();

            if (sg_space_ignore) sg_space_ignore.remove();
            if (js_dialog_overlay) {
                js_dialog_overlay.remove();
            }
            if (!cleared_cookies && document.cookie.split(";").length > 0) {
                document.cookie.split(";").forEach((cookie) => {
                    document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                })
                localStorage.clear();
                cleared_cookies = true;
            }
        }, 500);
        set_remove = true;
    }
}
}

export const UnlimitedBrainly: Module = {
    name: "UnlimitedBrainly",
    activate: brainlyLockPick,
    deactivate: NO_DEACTIVATE,
}

export default UnlimitedBrainly;