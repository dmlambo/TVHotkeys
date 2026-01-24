import { Hotkey, HotkeyBinding } from "./hotkeys";

const list: HTMLLIElement = document.getElementById("list") as HTMLLIElement;
const capture: HTMLButtonElement = document.getElementById("capture") as HTMLButtonElement;

function loadHotkeys(cb: (hotkeys: HotkeyBinding[]) => void) {
  browser.storage.sync.get({ hotkeys: [] }).then((res) => cb(res.hotkeys));
}

function saveHotkeys(hotkeys: HotkeyBinding[] ) {
  browser.storage.sync.set({ hotkeys: JSON.stringify(hotkeys) });
}

function render(hotkeys: HotkeyBinding[]) {
  list.innerHTML = "";

  for (const hk of hotkeys) {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.className = "hotkey";
    label.textContent = hk.hotkey.toString();

    const del = document.createElement("button");
    del.textContent = "✕";
    del.onclick = () => {
      saveHotkeys(hotkeys.filter(h => h !== hk));
      render(hotkeys.filter(h => h !== hk));
    };

    li.append(label, del);
    list.appendChild(li);
  }
}

loadHotkeys(render);

capture.addEventListener("click", () => {
  capture.textContent = "Press combo…";
  capture.focus();

  const handler = (e: KeyboardEvent) => {
    e.preventDefault();

    if (e.key === "Escape") {
      capture.textContent = "Click, then press a key combo";
      window.removeEventListener("keydown", handler, true);
      return
    }

    if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return

    // Require at least one modifier
    if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      capture.textContent = "Use a modifier key"
      return
    }

    const newHotkey: Hotkey = {
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
      meta: e.metaKey
    };    

    loadHotkeys((hotkeyBindings) => {
      const newHotkeyBinding: HotkeyBinding = {
        name: "New Hotkey Binding",
        hotkey: newHotkey,
        order: {
          action: "Buy",
          amountMode: "Shares",
          amountValue: 100,
          priceMode: "Market",
          priceValue: 0,
          eth: true
        }
      }
      hotkeyBindings.push(newHotkeyBinding);

      saveHotkeys(hotkeyBindings);
      render(hotkeyBindings);
    });

    capture.textContent = "Click, then press a key combo";
    window.removeEventListener("keydown", handler, true);
  };

  window.addEventListener("keydown", handler, true);
});