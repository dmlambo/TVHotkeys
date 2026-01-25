export enum Action {
  Buy = "Buy",
  Sell = "Sell"
}

export enum AmountMode {
  Shares = "Shares",
  PercentAvailableFunds = "PercentAvailableFunds",
  PercentPosition = "PercentPosition"
}

export enum OrderMode {
  Market = "Market",
  Limit = "Limit",
  Stop = "Stop"
}
  
export enum PriceReference {
  Ask = "Ask",
  Bid = "Bid",
  Midpoint = "Midpoint"
}

export enum PriceMode {
  Offset = "Offset",
  PercentOffset = "PercentOffset"
}

export class RelativePrice 
{
  reference: PriceReference
  mode: PriceMode
  value: number

  constructor(reference: PriceReference, mode: PriceMode, value: number)
  {
    this.reference = reference
    this.mode = mode
    this.value = value
  }
}

export class Order 
{
  action: Action
  orderMode: OrderMode
  amountMode: AmountMode
  amountValue: number
  price: RelativePrice | undefined

  constructor(action: Action, orderMode: OrderMode, amountMode: AmountMode, amountValue: number, price?: RelativePrice) {
    this.action = action
    this.orderMode = orderMode
    this.amountMode = amountMode
    this.amountValue = amountValue
    this.price = price
  }
}
