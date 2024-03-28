/*  -----------------------------------------------------------------------------------------------

    -- toggle_theme.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This is the setting and implementation for toggling themes in UES.

    ----------------------------------------------------------------------------------------------- */

declare function GM_getValue(name: string, defaultValue?: any): any;
declare function GM_setValue(name: string, value: any): void;

function toggleSiteTheme(mode: string) {
    if (document.readyState == "complete") {
        if (mode == "dark") {
            if (document.getElementsByClassName('home-page-background')[0]) {
                document.getElementsByClassName('home-page-background')[0].classList.add("dark-theme");
                Array.from(document.getElementsByClassName('sle-card')).forEach((element) => {
                    element.classList.add("dark-theme");
                })
                document.getElementsByClassName('navbar')[0].classList.add("dark-theme");
                Array.from(document.getElementsByClassName('container-progress')).forEach((element) => {
                    element.classList.add("dark-theme");
                })
                Array.from(document.getElementsByClassName('card-subject')).forEach((element) => {
                    element.classList.add("dark-theme");
                })
                Array.from(document.getElementsByClassName('progress-label')).forEach((element) => {
                    element.classList.add("dark-theme");
                })
            }


        } else if (mode == "light") {
            // Revert all the previous changes
            if (document.getElementsByClassName('home-page-background')[0]) {
                document.getElementsByClassName('home-page-background')[0].classList.remove("dark-theme");
                Array.from(document.getElementsByClassName('sle-card')).forEach((element) => {
                    element.classList.remove("dark-theme");
                })
                document.getElementsByClassName('navbar')[0].classList.remove("dark-theme");
                Array.from(document.getElementsByClassName('container-progress')).forEach((element) => {
                    element.classList.remove("dark-theme");
                })
                Array.from(document.getElementsByClassName('card-subject')).forEach((element) => {
                    element.classList.remove("dark-theme");
                })
                Array.from(document.getElementsByClassName('progress-label')).forEach((element) => {
                    element.classList.remove("dark-theme");
                })
            }
        }
    } else {
        setTimeout(() => {
            toggleSiteTheme(mode);
        }, 500);
    }
}


function toggleTheme() {

}

export function setTheme() {
    // Set html theme
    const theme = GM_getValue('ues-theme', 'light');
    document.documentElement.dataset.theme = theme;
}

export function registerToggleThemeListener() {
    let toggleIcn = document.getElementById("ues-toggle-theme-icn");
    if (toggleIcn !== null) {
        toggleIcn.addEventListener("click", toggleTheme);
    }
}

export default registerToggleThemeListener;