import GM from "./types/greasemonkey.types";

export function initDragElement(ele: HTMLElement) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("ues-header-draggable-ui")) {
        document.getElementById("ues-header-draggable-ui")!.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        ele.onmousedown = dragMouseDown;
    }
    let savedPosition = GM.GM_getValue("ues-gui-position");
    if (savedPosition) {
        ele.style.top = savedPosition.top;
        ele.style.left = savedPosition.left;
    }

    function dragMouseDown(event: MouseEvent) {
        event.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = () => {
            GM.GM_setValue("ues-gui-position", {
                top: ele.style.top,
                left: ele.style.left
            });
            document.onmouseup = null;
            document.onmousemove = null;
        };
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(event: MouseEvent) {
        event.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        ele.style.top = (ele.offsetTop - pos2) + "px";
        ele.style.left = (ele.offsetLeft - pos1) + "px";
    }
}

export default initDragElement;
