export type Action = 
  "Buy" |
  "Sell"

export type AmountMode = 
  "Shares" | 
  "Percent"

export type PriceMode =
  "Market" |
  "PriceOffset" | 
  "PercentOffset"

export class Order 
{
  action: Action
  amountMode: AmountMode
  amountValue: number
  priceMode: PriceMode
  priceValue: number

  eth: boolean

  constructor(action: Action, amountMode: AmountMode, amountValue: number, priceMode: PriceMode, priceValue: number, eth: boolean) {
    this.action = action
    this.amountMode = amountMode
    this.amountValue = amountValue
    this.priceMode = priceMode
    this.priceValue = priceValue
    this.eth = eth
  }
}

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

  public toString() {
    var mod = ""
    if (this.alt) mod += "Alt + "
    if (this.shift) mod += "Shift + "
    if (this.ctrl) mod += "Ctrl + "
    if (this.meta) mod += "Meta + "
    return mod + this.key.toUpperCase()
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
      action: "Sell",
      amountMode: "Percent",
      amountValue: 1.0,
      priceMode: "PercentOffset",
      priceValue: -0.1,
      eth: true,
  })
];