import * as fs from "fs";
var WARN_MSG = {
    EXPECT_TYPESCRIPT: "Gorilla recommends that your input files be written in TypeScript",
    EXPECT_GM_EXTENSION: "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file.",
    EXPECT_GM_KEYS: "GreaseMonkey script includes keys that GreaseMonkey does not support: "
};
var PACKAGE_JSON_LOCATION = "./package.json";
var PACKAGE_JSON_GORILLA_KEY = "gorilla";
var PACKAGE_JSON_KEYS = [
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "copyright",
    "license",
];
export var VALID_GORILLA_CONFIG_KEYS = [
    "author",
    "description",
    "exclude",
    "grant",
    "icon",
    "include",
    "match",
    "name",
    "namespace",
    "noframes",
    "require",
    "resource",
    "version",
    "updateURL",
    "downloadURL",
];
export var getConfig = function (inputConfigLocation) {
    var tmpConfig = {};
    // Config passed in by input
    if (inputConfigLocation && inputConfigLocation !== "") {
        try {
            var inputConfig_1 = JSON.parse(fs.readFileSync(inputConfigLocation, "utf8"));
            Object.keys(inputConfig_1).forEach(function (key) {
                tmpConfig[key] = inputConfig_1[key];
            });
        }
        catch (err) {
            console.error("Failed to parse input config", err);
        }
    }
    // Read `package.json`
    if (fs.existsSync(PACKAGE_JSON_LOCATION)) {
        var packageJSON_1 = JSON.parse(fs.readFileSync(PACKAGE_JSON_LOCATION, "utf8"));
        // Read common keys
        PACKAGE_JSON_KEYS.forEach(function (key) {
            if (packageJSON_1[key]) {
                if (!tmpConfig[key]) {
                    tmpConfig[key] = packageJSON_1[key];
                }
            }
        });
        // Read valid Gorilla keys
        if (packageJSON_1[PACKAGE_JSON_GORILLA_KEY]) {
            VALID_GORILLA_CONFIG_KEYS.forEach(function (key) {
                if (packageJSON_1[PACKAGE_JSON_GORILLA_KEY][key]) {
                    tmpConfig[key] = packageJSON_1[PACKAGE_JSON_GORILLA_KEY][key];
                }
            });
        }
    }
    return tmpConfig;
};
/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
export var getBanner = function (config, quiet) {
    if (quiet === void 0) { quiet = false; }
    var invalidItems = Object.keys(config).filter(function (key) { return !VALID_GORILLA_CONFIG_KEYS.includes(key); });
    if (invalidItems.length > 0 && !quiet) {
        var msg = "".concat(WARN_MSG.EXPECT_GM_KEYS, " ").concat(invalidItems.join(", "));
        console.warn(msg);
    }
    var items = Object.keys(config)
        .map(function (key) { return ({ key: key, value: config[key] }); })
        .map(function (item) {
        return Array.isArray(item.value)
            ? item.value.map(function (inner) { return ({ key: item.key, value: inner }); })
            : item;
    })
        .flatMap(function (i) { return i; });
    var scriptLines = items
        .map(function (_a) {
        var key = _a.key, value = _a.value;
        var tabs = key.length < 8 ? "\t\t\t" : "\t\t";
        return "// @".concat(key).concat(value ? "".concat(tabs).concat(value) : "");
    })
        .join("\n");
    return "\n  // ==UserScript==\n  ".concat(scriptLines, "\n  // ==/UserScript==\n");
};
