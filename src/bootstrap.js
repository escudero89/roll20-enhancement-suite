import { Config } from "./tools/config";

function injectScript(name) {
    console.log(`Injecting ${name}`);

    var s = document.createElement("script");
    s.async = false;
    s.src = (chrome || browser).extension.getURL(`js/${name}.js`);

    s.onload = () => { s.remove(); };
    document.head.appendChild(s);
}


console.log("=================");
console.log("window.r20es bootstrap");
console.log("=================");

// inject global environment
injectScript("globals");

// TODO : do this automaticall via hooks.js
// modules
injectScript("add-duplicate-to-journal-menu");
injectScript("auto-ping-next-token");
injectScript("auto-select-next-token");
injectScript("bulk-macros");
injectScript("character-io");
injectScript("draw-current-layer");
injectScript("initiative-shortcuts");
injectScript("middle-click-select");
injectScript("move-camera-to-token-on-turn");
injectScript("table-io");
injectScript("token-layer-drawing");

// setup comms with the backend
let bgComms = browser.runtime.connect(Config.extentionId);

function bgListener(msg) {
    console.log("Received background message");
    if (msg.hooks) {
        window.postMessage({ r20es_hooks: msg.hooks }, "https://app.roll20.net/editor/");
    }
}

bgComms.onMessage.addListener(bgListener);

console.log("requesting hooks from backend");
bgComms.postMessage({ request: "hooks" });

console.log("window.r20es bootstrap done");