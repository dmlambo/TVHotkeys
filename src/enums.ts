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