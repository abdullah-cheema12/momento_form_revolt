import { bootstrap } from "./bootstrap";

function getCookie(cookieName: any) {
    const cookies = document.cookie;
    const cookieData = cookies.split("; ");
    const cookieObject: { [key: string]: any } = {};
    for (const cookie of cookieData) {
        const [name, value] = cookie.split("=");
        cookieObject[name] = decodeURIComponent(value)
    }

    return JSON.parse(cookieObject[cookieName])
}

type firebaseResponse = {
    "user-id": string,
    tokenInUse: boolean
    expiryTime?: {
        _seconds: number,
        _nanoseconds?: number
    }
    serviceKey: boolean,
}
declare global {
    interface Window {
        expiryTimestamp: number;
    }
}

window.expiryTimestamp;

// False if the key is not expired, True if the key is expired
function isKeyExpired(data: firebaseResponse) {
    // Convert the Milliseconds that Date.now() outputs to seconds
    let currentDate = Math.floor(Date.now() / 1000);

    if (!data.expiryTime) {
        // If expiryTime is not defined, the key is valid forever
        window.expiryTimestamp
        return false;
    }

    // This assumes that if expiryTime is not defined, the key is valid forever, this will last until 5138, 
    // however we will just change it to never expires in the frontend.
    if (data.expiryTime._seconds < currentDate) {
        addErrorMessage("Key Expired! Join Discord for a new key.")
        return true;
    } else {
        window.expiryTimestamp = data.expiryTime._seconds;
        return false;
    };
}

export async function checkUserValidation() {
    return new Promise(async (resolve, reject) => {
        const userInputKeyFromLocalStorage = localStorage.getItem("userInputKey"); //pick from url
        const userId = getCookie("TokenData").UserId;

        async function validateUserData(userValue: string) {
           const data: firebaseResponse = await fetchFirebase(userValue)

            if (!data) {
                addErrorMessage("Incorrect Key! Contact Support for help.")
                return false;
            }

            if (isKeyExpired(data) == true) return false;



            if (data["user-id"] === userId && data["tokenInUse"]) {
                const overlay = document.getElementById("overlay");
                const overlayContent = document.getElementsByClassName("overlay")[0] as HTMLDivElement;
                if (overlay) {
                    overlayContent.style.opacity = "0"
                    setTimeout(() => {
                        window.location.reload();
                    }, 500)
                }
                localStorage.setItem("userInputKey", userValue)
                return true
            }
            // serviceKey is a special key type that allows the user to use the key on multiple accounts.
            if (data["tokenInUse"] && data["user-id"] !== "null" && !data.serviceKey) {
                addErrorMessage("This key is already in use. Each key can only be used once!")
                return false
            }
            try {
                if (!data.serviceKey) {
                    await updateFirebase(userValue, {
                        "user-id": userId,
                        tokenInUse: true
                    })
                }
                localStorage.setItem("userInputKey", userValue)
                const overlay = document.getElementById("overlay");
                const overlayContent = document.getElementsByClassName("overlay")[0] as HTMLDivElement;
                if (overlay) {
                    overlayContent.style.opacity = "0";
                    setTimeout(() => {
                        window.location.reload();
                    }, 500)
                };
                return true
            } catch (error) {
                addErrorMessage("Error While Validating! Please try again later.")
            }
            return true
        }

        async function handleFormSubmit(e: Event) {
            e.preventDefault();
            const userInput = document.querySelector("#input-key") as HTMLInputElement;
            try {
                const isValid = await validateUserData(userInput.value);
                resolve(isValid);
                if (isValid == true) {

                }
            } catch (error) {
                reject(error);
            }
        }

        // If the user is already validated don't prompt to Enter License Key
        if (userInputKeyFromLocalStorage) {
            if (await validateUserData(userInputKeyFromLocalStorage) == true) {
                resolve(true);
            } else {
                addKeyInputBox();
                const userInputForm = document.querySelector("#user-form");
                if (userInputForm) userInputForm.addEventListener("submit", handleFormSubmit);
                addErrorMessage("Please Re-enter License Key")
                reject();
            }
        } else {
            addKeyInputBox();
            const userInputForm = document.querySelector("#user-form");
            if (userInputForm) userInputForm.addEventListener("submit", handleFormSubmit);
        }
    });
}

function addKeyInputBox() {
    const template = `
    <div id="overlay">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Kanit:wght@100;400;500;600&display=swap');

        .overlay * {
            font-family: 'Archivo Black', sans-serif !important;
        }

        .enter-key {
            padding: 1.3rem 2rem;
            border: none;
            outline: none;
            color: rgb(255, 255, 255);
            background: #111;
            cursor: pointer;
            position: relative;
            z-index: 0;
            border-radius: 10px;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            font-weight: bold;
            transition: font-size 0.3s ease-in-out, color 0.3s ease-in-out, background-color 0.3s ease-in-out;
        }

        .enter-key:before {
            content: "";
            background: linear-gradient(45deg,
                    #0000ff,
                    #0088ff,
                    #00ffff,
                    #00ff88,
                    #00ff00,
                    #88ff00,
                    #ffff00,
                    #ff8800,
                    #ff0000);
            position: absolute;
            top: -2px;
            left: -2px;
            background-size: 400%;
            z-index: -1;
            filter: blur(5px);
            -webkit-filter: blur(5px);
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            animation: glowing-ask-brainly 20s linear infinite;
            transition: opacity 0.3s ease-in-out;
            border-radius: 10px;
        }

        @keyframes glowing-ask-brainly {
            0% {
                background-position: 0 0;
            }

            50% {
                background-position: 400% 0;
            }

            100% {
                background-position: 0 0;
            }
        }

        .enter-key:after {
            z-index: -1;
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: #222;
            left: 0;
            top: 0;
            border-radius: 10px;
        }

        .enter-key:hover {
            /* font-size: 1.1em; */
            background-color: initial;
            color: rgb(255, 255, 255);
        }

        .enter-key:active, .enter-key:focus {
            color: #fff;
            background-color: #111;
            border: none;
        }

        .overlay {
            height: 100vh;
            width: 100%;
            background-color: #fff;
            position: fixed;
            z-index: 100;
            opacity: 1;
            transition: opacity 250ms ease-in-out;
        }

        .overlay-container {
            width: 50%;
            margin: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        .prompt-box {
            width: 85%;
            height: 150px;
        }

        .prompt-box h2 {
            text-align: center;
            letter-spacing: 1px;
        }

        .prompt-box input {
            margin: 1rem auto;
            width: 100%;
            display: block;
            padding: 0.5rem;
            border-radius: 4px;
            background: transparent;
            border: 2px solid #fff;
            color: #fff;
        }

        .prompt-box input:autofill {
            background: #111;
            border: 2px solid #fff;
            color: #fff;
        }

        .prompt-box input:focus {
            background: trasparent;
            color: #fff;
        }

        .prompt-box span {
            position: relative;
            display: block;
            width: 80%;
            margin: auto;
        }

        .prompt-box button {
            position: absolute;
            bottom: 50%;
            top: 21%;
            right: 2%;
            width: fit-content;
            background: transparent;
            outline: none;
            border: none;
        }

        .prompt-box svg {
            color: #fff;
            width: 25px;
            height: 20px;
        }

        #message-box-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .error-box {
            border: 2px solid #fd4b4b;
            background-color: #fd4b4b;
            color: #ffffff;
            border-radius: 20px;
            box-shadow: 0 0 20px rgba(211, 47, 47, 0.6);
            text-align: center;
            max-width: 500px;
            box-sizing: border-box;
            width: 100%;
        }

        .error-box p {
            margin: 0;
            font-size: 12px;
            font-weight: 500;
        }
    </style>
    <div class="overlay">
        <div class="overlay-container">
            <div class="prompt-box enter-key">
                <h2>Welcome to Revolt</h2>
                <span>
                    <form id="user-form">
                        <input type="text" id="input-key" placeholder="Enter License key">
                        <button type="submit"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg></button>
                    </form>
                </span>
                <div id="message-box-container">

                </div>
            </div>
        </div>
    </div>
</div>
    `;
    document.body.prepend(new DOMParser().parseFromString(template, "text/html").body.firstChild as HTMLElement);
}

function addErrorMessage(msg: string) {
    const errorBox = document.getElementById("message-box-container")
    const template = ` <div class="error-box">
        <p>${msg}</p>
     </div>`
    if (errorBox) errorBox.innerHTML = template
}

async function fetchFirebase(key: string) : Promise<firebaseResponse> {
    return new Promise((resolve, reject) => {
     GM.xmlHttpRequest({
        method: "GET",
        url: `https://us-central1-crank-75395.cloudfunctions.net/Crank?key=${key}`, // The URL you want to access which is different from your page's origin
        onload: function(res) {
            // Handle the response

            resolve(JSON.parse(res.response))
        },
        onerror: function() {
            // Handle errors
            reject(false);
        }
    });
})
}

function displayInactiveMessage() {
    alert("Revolt is currently offline. Please be patient while we work to restore operations :)");
}

function displayWrongVersionMessage(current_version: string, RELEASED_VER: string) {
    const update_msg = `\nYou must update to the latest version of Revolt to continue using Revolt.\n\nCurrent Version: v${current_version} \nLatest Version: v${RELEASED_VER} \n\nClick OK then click the link on the screen to update to the latest version.`;
    alert(update_msg);
    const Revolt_link = "https://discord.gg";
    document.body.innerHTML = `
        <div style="margin-top:50vh;text-align:center;">
            <a id = "update_edgy_link" style="color:blue;text-decoration:none;" href="${Revolt_link}"><h1>Click to update to the latest version of Revolt (v${RELEASED_VER})</h1></a>
        </div>
    `;
}

export async function userHasAccess() {
    const current_version = '3.11';
    try {
        const response = await fetch('https://raw.githubusercontent.com/kaidadnd/Revolt/main/settings.json');
        const settings = await response.json();
        if (!settings.ACTIVE) {
            displayInactiveMessage();
            return false;
        }
        if (Number(settings.CURRENT_VERSION_OUT) > Number(current_version)) {
            displayWrongVersionMessage(current_version, settings.CURRENT_VERSION_OUT);
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

async function updateFirebase(key: string, body: any){
    return new Promise((resolve, reject) => {
     GM.xmlHttpRequest({
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(body),
        url: `https://us-central1-crank-75395.cloudfunctions.net/crankupdatekey?key=${key}`,
        onload: (res) => { 
            resolve(JSON.parse(res.response)) 
        },
        onerror: () => {
            // Handle errors
            reject(false);
        }
    });
    })
}