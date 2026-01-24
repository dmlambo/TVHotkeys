// Inject page-context script
const script = document.createElement("script");
script.src = chrome.runtime.getURL("pageScript.js");
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

console.log("🔥 content script loaded", location.href);

hotkeys = []

// Hotkey Schema
const DEFAULT_HOTKEYS = [
  {
    name: "Liquidate Entire Position",
    action: "sell",
    value: 1,
    amountMode: "positionPercent",
    amountValue: 1.0,
    priceMode: "limitOffsetPercent",
    priceValue: -0.1,
    eth: true,
    combo: { alt: true, ctrl: false, shift: false, meta: false, key: "k" }
  }
];

function matchHotkey(event, combo) {
  return (
    event.key.toLowerCase() === combo.key &&
    event.altKey === combo.alt &&
    event.ctrlKey === combo.ctrl &&
    event.shiftKey === combo.shift &&
    event.metaKey === combo.meta
  );
}

chrome.storage.sync.get({ hotkeys: DEFAULT_HOTKEYS }, ({ hotkeys: hotkeys_sync }) => {
  console.log("Loaded hotkeys", hotkeys_sync);
  hotkeys = hotkeys_sync
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.hotkeys) {
    hotkeys = changes.hotkeys.newValue;
  }
});

document.addEventListener("keydown", (e) => {
  for (const hk of hotkeys) {
    if (matchHotkey(e, hk.combo)) {
      e.preventDefault();
      e.stopImmediatePropagation();

      mod = ""
      if (e.altKey) mod += "Alt + "
      if (e.shiftKey) mod += "Shift + "
      if (e.ctrlKey) mod += "Ctrl + "
      if (e.metaKey) mod += "Meta + "
      mod += e.key.toUpperCase()

      console.log("Hotkey: ", mod, "(" + hk.name + ")")

      window.postMessage(
        {
          source: "TV-hotkeys-extension",
          action: hk.action
        },
        "*"
      );
    }
  }
});