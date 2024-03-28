/*  -----------------------------------------------------------------------------------------------

    -- module_manager.ts --
    Copyright (c) 2023 Revolt.

    Description:
    This module allows duplicate tabs to be opened, which allows you to do more than one thing at once.
    This module is force enabled.

    ----------------------------------------------------------------------------------------------- */

import { NO_DEACTIVATE } from './globals';
import { Module } from './modules';

function preventDuplicateTabs() {
    localStorage.removeItem("RecentPageID");
    localStorage.removeItem("WrongPageID");

    const originalSetItem: (typeof localStorage.setItem) = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        return key === "RecentPageID" || key === "WrongPageID" ? null : originalSetItem.apply(this, [key, value]);
    };

    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function (key: IArguments[0]) {
        return key === "RecentPageID" || key === "WrongPageID" ? null : originalGetItem.apply(this, [key]);
    };

    Object.defineProperty(document, "domain", {
        value: "core.learn.edgenuity.com",
        writable: false,
        configurable: false,
    });

    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (event: any, callback: any, options: any) {
        if (event !== "storage") {
            originalAddEventListener.apply(this, arguments as unknown as [event: any, callback: any, options: any]);
        }
    };

    Object.defineProperty(window, "thisPageID", {
        value: 10000000 * Math.random(),
        writable: false,
        configurable: false,
    });
}

export const preventDuplicateTabsModule: Module = {
    name: "preventDuplicateTabs",
    activate: preventDuplicateTabs,
    deactivate: NO_DEACTIVATE,
};

export default preventDuplicateTabsModule;