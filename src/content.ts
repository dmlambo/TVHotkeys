import { DEFAULT_HOTKEYS, Hotkey, HotkeyBinding } from "./hotkeys.js";

// Inject page-context script
const script = document.createElement("script");
script.src = browser.runtime.getURL("pageScript.js");
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

console.log("🔥 content script loaded", location.href);

var hotkeys: HotkeyBinding[] = []

function matchHotkey(event: KeyboardEvent, combo: Hotkey) {
  return (
    event.key.toLowerCase() === combo.key &&
    event.altKey === combo.alt &&
    event.ctrlKey === combo.ctrl &&
    event.shiftKey === combo.shift &&
    event.metaKey === combo.meta
  );
}

browser.storage.sync.get({ hotkeys: JSON.stringify(DEFAULT_HOTKEYS) }).then(({ hotkeys: hotkeys_sync }) => {
  console.log("Loaded hotkeys", hotkeys_sync);
  hotkeys = JSON.parse(hotkeys_sync)
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.hotkeys) {
    hotkeys = changes.hotkeys.newValue;
  }
});

document.addEventListener("keydown", (e) => {
  for (const hk of hotkeys) {
    if (matchHotkey(e, hk.hotkey)) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var mod = ""
      if (e.altKey) mod += "Alt + "
      if (e.shiftKey) mod += "Shift + "
      if (e.ctrlKey) mod += "Ctrl + "
      if (e.metaKey) mod += "Meta + "
      mod += e.key.toUpperCase()

      console.log("Hotkey: ", mod, "(" + hk.name + ")")

      window.postMessage(
        {
          source: "TV-hotkeys-extension",
          action: hk.order
        },
        "*"
      );
    }
  }
});