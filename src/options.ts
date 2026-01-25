import { DEFAULT_HOTKEYS, Hotkey, HotkeyBinding, NO_BINDING } from "./hotkeys.js";
import { Action, AmountMode, OrderMode, PriceMode, PriceReference, RelativePrice } from "./order.js";

const bindingsDiv = document.getElementById("bindings")!;
const newBindingButton: HTMLButtonElement = document.querySelector(".newBinding") as HTMLButtonElement

var capturing = false

function loadHotkeys(cb: (hotkeys: HotkeyBinding[]) => void) {
  browser.storage.sync.get({ hotkeys: JSON.stringify(DEFAULT_HOTKEYS) }).then((res) => cb(JSON.parse(res.hotkeys)))
}

function saveHotkeys(hotkeys: HotkeyBinding[] ) {
  browser.storage.sync.set({ hotkeys: JSON.stringify(hotkeys) })
}

function fillSelect<T extends string>(
  select: HTMLSelectElement,
  values: readonly T[]
) {
  select.innerHTML = "";
  for (const v of values) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  }
}

function newBinding()
{
  loadHotkeys((hotkeyBindings) => {
      const newHotkeyBinding: HotkeyBinding = {
        name: "New Hotkey Binding",
        hotkey: NO_BINDING,
        order: {
          action: Action.Buy,
          amountMode: AmountMode.Shares,
          amountValue: 100,
          roundSharesTo: 1,
          orderMode: OrderMode.Market,
          price: undefined
        }
      }
      hotkeyBindings.push(newHotkeyBinding)

      saveHotkeys(hotkeyBindings)
      render(hotkeyBindings)
    })
}

function captureHotkey(capture: HTMLDivElement, binding: HotkeyBinding, noModifier: () => void, finished: (changed: boolean) => void)
{
  const handler = (e: KeyboardEvent) => {
    e.preventDefault()

    if (e.key === "Escape") {
      window.removeEventListener("keydown", handler, true)
      finished(false)
      return
    }

    if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return

    // Require at least one modifier
    if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      noModifier()
      return
    }

    binding.hotkey = {
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
      meta: e.metaKey
    }

    window.removeEventListener("keydown", handler, true)
    finished(true)
  }

  window.addEventListener("keydown", handler, true)
}

function renderBinding(
  binding: HotkeyBinding,
  onChange: (rerender: boolean) => void
): HTMLElement {
  const tpl = document.getElementById("binding-template") as HTMLTemplateElement;
  const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const nameInput = el.querySelector(".name") as HTMLInputElement;
  const hotkeySelect = el.querySelector(".hotkeySelect") as HTMLDivElement;

  const actionSel = el.querySelector(".action") as HTMLSelectElement;
  const amountModeSel = el.querySelector(".amountMode") as HTMLSelectElement;
  const amountValueInput = el.querySelector(".amountValue") as HTMLInputElement;
  const sharesRoundInput = el.querySelector(".sharesRound") as HTMLInputElement;

  const orderModeSel = el.querySelector(".orderMode") as HTMLSelectElement;

  const priceSection = el.querySelector("#priceSection") as HTMLDivElement;
  const priceRefSel = el.querySelector(".priceReference") as HTMLSelectElement;
  const priceModeSel = el.querySelector(".priceMode") as HTMLSelectElement;
  const priceValueInput = el.querySelector(".priceValue") as HTMLInputElement;

  const deleteBtn = el.querySelector(".delete") as HTMLButtonElement;

  // Fill dropdowns
  fillSelect(actionSel, Object.values(Action) as string[]);
  fillSelect(amountModeSel, Object.values(AmountMode) as string[]);
  fillSelect(orderModeSel, Object.values(OrderMode) as string[]);
  fillSelect(priceRefSel, Object.values(PriceReference) as string[]);
  fillSelect(priceModeSel, Object.values(PriceMode) as string[]);

  // Initial values
  nameInput.value = binding.name;

  const hotkeyString = Hotkey.toString(binding.hotkey);
  if (hotkeyString) {
    hotkeySelect.textContent = hotkeyString;
  } else {
    hotkeySelect.textContent = "No Binding"
  }

  actionSel.value = binding.order.action;
  amountModeSel.value = binding.order.amountMode;
  amountValueInput.value = String(binding.order.amountValue);
  sharesRoundInput.value = String(binding.order.roundSharesTo ?? 1)
  orderModeSel.value = binding.order.orderMode;

  if (binding.order.price) {
    priceRefSel.value = binding.order.price.reference;
    priceModeSel.value = binding.order.price.mode;
    priceValueInput.value = String(binding.order.price.value);
  }

  // Market vs non-market UI
  function updatePriceVisibility() {
    const isMarket = orderModeSel.value === "Market";
    priceSection.style.display = isMarket ? "none" : "";
  }

  updatePriceVisibility();

  // Wiring updates back into model
  nameInput.onchange = () => {
    binding.name = nameInput.value;
    onChange(false);
  };

  hotkeySelect.onclick = () => {
    if (!capturing) {
      capturing = true

      const prevText = hotkeySelect.textContent

      hotkeySelect.textContent = "Press combo…"
      hotkeySelect.focus()
      captureHotkey(hotkeySelect, binding, 
        () => { hotkeySelect.textContent = "Use a modifier key" }, 
        (changed) => { capturing = false; if(changed) onChange(true); else hotkeySelect.textContent = prevText })
    }
  }

  actionSel.onchange = () => {
    binding.order.action = actionSel.value as Action;
    onChange(false);
  };

  amountModeSel.onchange = () => {
    binding.order.amountMode = amountModeSel.value as AmountMode;
    onChange(false);
  };

  amountValueInput.onchange = () => {
    binding.order.amountValue = Number(amountValueInput.value);
    onChange(false);
  };

  orderModeSel.onchange = () => {
    binding.order.orderMode = orderModeSel.value as OrderMode;

    if (binding.order.orderMode === "Market") {
      binding.order.price = undefined;
    } else if (!binding.order.price) {
      // Create default relative price when switching away from Market
      binding.order.price = new RelativePrice(PriceReference.Ask, PriceMode.Offset, 0);
    }

    updatePriceVisibility();
    onChange(false);
  };

  priceRefSel.onchange = () => {
    binding.order.price!.reference = PriceReference[priceRefSel.value as keyof typeof PriceReference]
    onChange(false);
  };

  priceModeSel.onchange = () => {
    binding.order.price!.mode = PriceMode[priceModeSel.value as keyof typeof PriceMode];
    onChange(false);
  };

  priceValueInput.onchange = () => {
    binding.order.price!.value = Number(priceValueInput.value);
    onChange(false);
  };

  deleteBtn.onclick = () => {
    loadHotkeys((bindings) => {
      const newBindings = bindings.filter(h => JSON.stringify(h) !== JSON.stringify(binding))
      saveHotkeys(newBindings)
      render(newBindings)
    })
  };

  return el;
}

function render(bindings: HotkeyBinding[]) {
  bindingsDiv.innerHTML = ""

  for (const binding of bindings) {
    const row = renderBinding(binding, (rerender: boolean) => { 
      saveHotkeys(bindings)
      if (rerender) render(bindings)
    });
    bindingsDiv.appendChild(row);
  }
}

newBindingButton.onclick = newBinding

loadHotkeys(render)
