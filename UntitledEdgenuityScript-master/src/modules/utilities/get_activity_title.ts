export function getActivityTitle(): string | null {
    let activityTitleEle = document.getElementById("activity-title")
    if (activityTitleEle) {
        let activityTitle = activityTitleEle.innerText.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase()
        return activityTitle;
    }
    return null;
}