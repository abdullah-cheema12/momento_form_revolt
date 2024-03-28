const search = [
    "cumulativeexamreview", "topicreviewactivity", "quiz", "unittestreview", "exam", "unittest",
    "cumulativeexam", "topictest", "practice", "pretest", "testreview", "test", "gcquiz", "cumulativereviewactivity",
    "cumulativetestreview", "cumulativeexamassessment", "culturegrams", "reading", "listening", "cumulativereview", "unitreview","labassessment","assessment",
    "prácticapractice","examencitoquiz","lección1lecture1","vocabulariovocabulary","lección1lecture2","lección1lecture3","lección1lecture4","lección1lecture5",
    "prescriptivetest"
];
const allowed = [
    "reflectionlecture", "explorationlecture", "lablesson", "lablecture", "introductorylecture",
    "spotlightlecture", "introductoryskillslecture", "applicationlecture", "applicationskillslecture", "lecture", "instruction", "warmup",
    "directinstruction", "instructional", "vocabulary", "part1", "part2", "part3", "part4", "part5", "part6", "part7", "part8", "part9", "part10",
    "pre-readlecture", "post-readlecture", "prereadlecture", "postreadlecture", "unitwrap-up", "wrap-up", "wrapup", "unitwrapup", "careerconnection",
    "casestudy", "unitoverview","grammerlecture","summary"
];
const assign = ["assignment","virtuallab","wetlab"];
const staged = ["prewriting","roughdraft","finaldraft","drafting","revising"];

export function determineActivityType() : string | null {
    let activityTitleEle = document.getElementById("activity-title")
    if (activityTitleEle) {
        return activityTitleEle.innerText.toLowerCase().trim().replace(" ", "");
    } else {
        return null;
    }
}

// function checkIfAssignmentLocked(SF: HTMLIFrameElement) {
//     setTimeout(() => {
//         if (!SF.contentDocument) return false;
//         let lock = SF.contentDocument.getElementsByClassName("overlay-attempt-button overlay-attempt-button-lock")
//         if (lock.length > 0) {
//             // The assignment is locked
//             // Alert the user and redirect them back to the dashboard
//             alert("This assignment is locked. Please get your teacher to unlock it for you! ⚠️")
//             window.location.href = "https://student.edgenuity.com/"
//             return true;
//         } 
//         return false;
//     }, 300);
//     // No idea how we would end up here, but typescript won't shut up about it.
//     return false;
// }

// export function handleActivityTypes(activityType: string) {
//     switch (activityType) {
//         case "unittest":
//         case "quiz":
//             // Check if the assignment is locked
//             let stageFrame = document.getElementById("stageFrame") as HTMLIFrameElement;
//             if (stageFrame) {
//                 stageFrame.addEventListener("load", () => {
//                     let isLocked = checkIfAssignmentLocked(stageFrame);
//                     if (!isLocked) {
//                         if (!stageFrame.contentDocument) return;
//                         let pastAttempts = stageFrame.contentDocument.getElementsByClassName("overlay-attempt-header")
//                         if (pastAttempts.length == 0) {
//                             let startButton = stageFrame.contentDocument.getElementsByClassName('overlay-attempt-button overlay-attempt-button-start')[0] as HTMLButtonElement;
//                             if (startButton) {
//                                 startButton.click();
//                             }
//                         }
//                     }
//                 })
//             }
//             break;
//     }
// }