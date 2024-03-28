export const NO_DEACTIVATE = Function();

type E2020Addresses = {
    "frameService": string,
    "videoFolder": string,
    "commonFolder": string,
    "frameProxyLinks": string,
    "assessmentService": string,
}

type StageFrameWindow = {
    API: {
        E2020: {
            userID: number,
            userToken: string,
            frameProgressID: number,
            autoPlayAudio: boolean,
            loggedIn: boolean,
            version: string,
            key: string,
            addresses: E2020Addresses
            toolbarOptions: string,
            studentBuildId: string,
            preferredLanguage: string,
            setDoNotTranslate: string,
        },
        LMSCommit: Function,
        LMSFinish: Function,
        LMSGetDiagnostics: Function,
        
    }
}

export namespace StageFrame {
    export type contentWindow = StageFrameWindow;
}