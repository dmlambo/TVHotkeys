const list = document.getElementById("list");
const capture = document.getElementById("capture");

function formatCombo(c) {
  return [
    c.ctrl && "Ctrl",
    c.alt && "Alt",
    c.shift && "Shift",
    c.meta && "Meta",
    c.key.toUpperCase()
  ].filter(Boolean).join(" + ");
}

function loadHotkeys(cb) {
  chrome.storage.sync.get({ hotkeys: [] }, (res) => cb(res.hotkeys));
}

function saveHotkeys(hotkeys) {
  chrome.storage.sync.set({ hotkeys });
}

function render(hotkeys) {
  list.innerHTML = "";

  for (const hk of hotkeys) {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.className = "combo";
    label.textContent = formatCombo(hk.combo);

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

  const handler = (e) => {
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

    const combo = {
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
      meta: e.metaKey
    };    

    loadHotkeys((hotkeys) => {
      console.log('fuck off')
      hotkeys.push({
        id: "doThing", // later: let user choose action
        combo
      });

      saveHotkeys(hotkeys);
      render(hotkeys);
    });

    capture.textContent = "Click, then press a key combo";
    window.removeEventListener("keydown", handler, true);
  };

  window.addEventListener("keydown", handler, true);
});