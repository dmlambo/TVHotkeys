import { Action, AmountMode, OrderMode, PriceMode, PriceReference } from "./enums.js"
import { Order, RelativePrice } from "./order.js"

export class Hotkey
{
  alt: boolean
  ctrl: boolean
  shift: boolean
  meta: boolean

  key: string

  constructor(alt: boolean, ctrl: boolean, shift: boolean, meta: boolean, key: string) 
  {
    this.alt = alt
    this.ctrl = ctrl
    this.shift = shift
    this.meta = meta
    this.key = key
  }

  public static toString(hotkey: Hotkey) {
    var mod = ""
    if (hotkey.alt) mod += "Alt + "
    if (hotkey.shift) mod += "Shift + "
    if (hotkey.ctrl) mod += "Ctrl + "
    if (hotkey.meta) mod += "Meta + "
    return mod + hotkey.key.toUpperCase()
  }
}

export class HotkeyBinding
{
  name: string
  hotkey: Hotkey
  order: Order

  constructor(name: string, hotkey: Hotkey, order: Order)
  {
    this.name = name
    this.hotkey = hotkey
    this.order = order
  }
}

// Hotkey Schema
export const DEFAULT_HOTKEYS: Array<HotkeyBinding> = [
  new HotkeyBinding(
    "Liquidate Entire Position",
    {
      alt: true, 
      ctrl: false, 
      shift: false, 
      meta: false, 
      key: "k"
    }, 
    {
      action: Action.Sell,
      orderMode: OrderMode.Limit,
      amountMode: AmountMode.PercentPosition,
      amountValue: 1.0,
      price: {
        mode: PriceMode.PercentOffset,
        reference: PriceReference.Ask,
        value: 0.1
      }
  })
];