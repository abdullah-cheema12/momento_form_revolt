export const css =`
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css");

:root {
    --primary-clr: #fff;
    --text-clr: #000;
    --text-clr-secondary: #494949;
    --box-shadow-clr: #838383;
    --btn-background: #d8d8d8;
    --btn-color: #fff;
    --bottom-link-color: #838383;
    --gradient: linear-gradient(180deg, rgba(34, 154, 185, 1) 0%, rgba(27, 89, 129, 1) 100%);
}

:root[data-theme="dark"] {
    --primary-clr: #151515;
    --text-clr: #fff;
    --text-clr-secondary: #a1a1a1;
    --btn-background: #212529;
    --box-shadow-clr: #3a3a3a;
    --btn-color: #fff;
    --bottom-link-color: #b7b7b7;
}

body {
    height: 100vh;
}

#ues-draggable-ui *:not(.bx) {
    font-family: "Poppins", sans-serif !important;
}

#ues-draggable-ui {
    position: absolute;
    z-index: 99999998;
    border-radius: 18px;
    width: 325px;
    top: 100px;
    font-family: "Poppins", sans-serif !important;
    font-weight: 500;
    transition: opacity 250ms ease-in-out;
    line-height: 1.5;
    opacity: 1;
}

.revolt-logo {
    height: 40px;
    border-radius: 50%;
}

.revolt-header-text-container {
    display: flex;
    flex-direction: column;
}

.revolt-title {
    font-size: 20px;
    color: var(--text-clr);
}

.revolt-key-expiration {
    font-size: 14px;
    color: var(--text-clr);
}

.revolt-key-expiration-date {
    font-size: 14px;
    color: var(--text-clr-secondary);
}

#ues-header-draggable-ui {
    padding: 10px;
    cursor: move;
    z-index: 99999999;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    font-size: 18px;
    font-weight: 500;
    background-color: var(--primary-clr) !important;
    color: var(--text-clr);
    display: flex;
    gap: 10px;
    align-items: center;
    height: 75px;
}

#ues-content-draggable-ui {
    overflow: hidden;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    box-shadow: -1px 3px 9px var(--box-shadow-clr) inset;
    background-color: var(--primary-clr);
    z-index: -2;
    position: relative;
}

.modules-container {
    z-index: -3;
    position: relative;
}

.modules-container::-webkit-scrollbar {
    width: 5px;
}

.modules-container::-webkit-scrollbar-thumb {
    background: var(--gradient);
    border-radius: 20px;
}

.modules-container::-webkit-scrollbar-track {
    background: #c8c8c8;
}

.modules-container {
    height: 275px;
    overflow-y: scroll;
}

.ues-sm-button {
    width: 95%;
    border-radius: 10px;
    margin: 10px auto;
    cursor: pointer;
    position: relative;
    height: 40px;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-inline: 10px;
    overflow: hidden;
    z-index: -2;
    background: var(--btn-background);
    color: var(--text-clr);
    transition: 250ms ease-in-out;
}

.ues-bottom-btn {
    height: 40px;
    font-weight: 400;
    width: auto;
    position: relative;
    background: var(--primary-clr);
    color: var(--text-clr);
    border-radius: 10px;
    padding: 5px;
    border: 4px solid transparent;
    padding-inline: 10px;
    cursor: pointer;
}

.ues-bottom-btn.selected {
    background: linear-gradient(var(--primary-clr), var(--primary-clr)) padding-box, var(--gradient) border-box;
}

.theme-icon {
    font-size: 18px;
    position: relative;
    top: 3px;
}

.ues-bottom-btn.selected > .theme-icon {
    background: var(--gradient);
    background-clip: text;
    color: transparent;
}

.ues-bottom-btn.selected > .bottom-btn-text {
    background: var(--gradient);
    background-clip: text;
    color: transparent;
}

.ues-sm-button::after { 
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradient);
    z-index: -1;
    opacity: 0;
    transition: 250ms ease-in-out;
}

.ues-sm-button.selected {
    color: var(--btn-color);
}

.ues-sm-button.selected::after {
    opacity: 1;
}

.bottom-link {
    font-size: 24px;
    cursor: pointer;
    padding-bottom: 10px;
    text-decoration: none;
    color: var(--bottom-link-color);
}

.bottom-link:visited {
    color: var(--bottom-link-color);
}

.link-button-light {
    color: #aeaeae;
}

.bottom-container {
    display: flex;
    align-items: center;
    padding-top: 10px;
    box-shadow: 0px 0px 9px 0px var(--box-shadow-clr);
    flex-direction: column;
    gap: 10px;
}


.themes-container {
    display: flex;
    gap: 10px;
}

.ues-stealth-reminder {
    font-size: 14px;
    color: #ff0000;
    font-family: 'Poppins';
    margin-left: 20px;
    position: absolute;
    top: 90%;
    opacity: 0;
    transition: opacity 250ms ease-in-out;
}

.ues-sm-select {
    width: 95%;
    border: 3px solid #333333; 
    border-radius: 15px; 
    margin: 10px auto; 
    cursor: pointer; 
    padding: 2px; 
    transition: 250ms ease-in-out; 
    height: 34px; 
    font-size: 16px;
}

.ues-sm-container {
    width: 95%;
    display: flex;
    gap: 10px;
    padding-inline: 10px;
    margin: 10px auto;
    align-items: center;
    justify-content: space-between;
}

.ues-sm-input {
    border: 2px solid #333333;
    border-radius: 10px;
    padding: 2px;
    height: 34px;
    font-size: 16px;
    text-align: center;
    width: 50%;
    background-color: var(--btn-background);
    color: var(--text-clr-secondary);
}
.ues-sm-input.dark {
    background-color: var(--text-clr);
    color: var(--primary-clr);
    border: 3px solid var(--primary-clr);
}
.ues-sm-input:focus {
    outline: none;
}
.ues-sm-label {
    color: var(--text-clr-secondary);
}
`;