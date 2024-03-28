import moduleManager from "./module_manager";
import * as authentication from "./authentication"
import modules from "./modules/modules";
import { bootstrap } from "./bootstrap";



let urlBlacklist: string[] = ["https://auth.edgenuity.com/Login/Login/Student/"];

async function initialize() {
    if (window.location.href.includes("https://brainly.com")) {
        return moduleManager.activateModule("brainly")
    }

    if (window == window.top) {
        document.addEventListener('DOMContentLoaded', () => {
            (document.getElementsByClassName('home-page-background')[0] as HTMLDivElement).style.transition = "250ms ease-in-out"
        })
        const haveAccess = await authentication.userHasAccess();
        if (haveAccess) {
            let cuv = await authentication.checkUserValidation();
            if (cuv == true) {
                moduleManager.activateSavedModules();
                bootstrap();
            }
        }
    }
}

if (window == window.top) {
    if (!urlBlacklist.includes(window.location.href)) {
        modules.preventDuplicateTabs.activate();
        modules.MuteSite.activate();
        modules.preventLogout.activate();
        setTimeout(() => {
            initialize();
        }, 1000);
    }
}
