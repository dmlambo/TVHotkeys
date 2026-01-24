enum Action {
  Buy,
  Sell
}

enum AmountMode {
  Shares,
  Percent // Percent of position, or percent of account
}

enum PriceMode {
  PriceOffset,
  PercentOffset
}

export class Order 
{
  name: string
  action: Action
  amountMode: AmountMode
  amountValue: number
  priceMode: PriceMode
  priceValue: number

  eth: boolean

  constructor(name: string, action: Action, amountMode: AmountMode, amountValue: number, priceMode: PriceMode, priceValue: number, eth: boolean) {
    this.name = name
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
}

export class HotkeyBinding
{
  hotkey: Hotkey
  order: Order

  constructor(hotkey: Hotkey, order: Order)
  {
    this.hotkey = hotkey
    this.order = order
  }
}

// Hotkey Schema
const DEFAULT_HOTKEYS = [
  new HotkeyBinding(
    {
      alt: true, 
      ctrl: false, 
      shift: false, 
      meta: false, 
      key: "k"
    }, 
    {
      name: "Liquidate Entire Position",
      action: Action.Sell,
      amountMode: AmountMode.Percent,
      amountValue: 1.0,
      priceMode: PriceMode.PercentOffset,
      priceValue: -0.1,
      eth: true,
  })
];