import { Order } from "./order.js"

declare global {
  const TradingViewApi: any
}

window.addEventListener("message", async (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== "TV-hotkeys-extension") return;

  const order = event.data.order as Order

  // To execute: 
  // foo = TradingViewApi.trading()._orderViewController._orderViewModel.preOrder()
  //  ... modify ... 
  // TradingViewApi.trading().activeBroker().placeOrder(foo) 
  // side == 1 = buy
  // side == -1 = sell
  // type == 1 = limit
  // type == 2 = market
  // type == 3 = stop

  const trading = TradingViewApi.trading()
  const activeBroker = trading.activeBroker()

  // TODO: Pop up warning that you have to open the trading window for this extention to work.
  if (!activeBroker) {
    console.warn("Could not find active broker, make sure you have a Paper Trading account open")
    return
  }

  const accountManagerInfo = activeBroker.accountManagerInfo()

  if (accountManagerInfo.accountTitle != "Paper Trading") {
    console.warn("Could not find Paper Trading account info, active broker is ", activeBroker.accountManagerInfo().accountTitle)
    return
  }

  const orderViewModel = trading._orderViewController._orderViewModel

  if (!orderViewModel) {
    console.warn("Could not find Paper Trading broker panel, make sure it's open before using hotkeys.")
    return
  }

  const preOrder = orderViewModel.preOrder()

  var orderPrice: number = preOrder.seenPrice

  if (order.price) {
    switch(order.price.reference) 
    {
      case "Ask":
        orderPrice = preOrder.currentQuotes.ask
        break
      case "Bid":
        orderPrice = preOrder.currentQuotes.bid
        break
      case "Midpoint":
        orderPrice = (preOrder.currentQuotes.bid + preOrder.currentQuotes.ask) / 2
        break
    }
    switch(order.price.mode) 
    {
      case "Offset":
        orderPrice += order.price.value
        break
      case "PercentOffset":
        orderPrice += orderPrice * order.price.value
        break
    }
  }

  switch(order.orderMode) {
    case "Market":
      preOrder.type = 2
      // Used in calculating percents lower down
      switch(order.action) 
      {
        case "Buy":
          orderPrice = preOrder.currentQuotes.ask
          break
        case "Sell":
          orderPrice = preOrder.currentQuotes.bid
          break
      }
      break
    case "Limit":
      preOrder.type = 1
      preOrder.limitPrice = orderPrice
      break
    case "Stop":
      preOrder.type = 3
      preOrder.stopPrice = orderPrice
      break
  }  

  switch(order.amountMode) {
    case "Shares":
      if (order.amountValue < 0) {
        console.warn("Cannot trade negative amount of shares: ", order.amountValue)
        return
      }
      preOrder.qty = order.amountValue
      break
    // Not sure if this is the best way to get available funds. There should be an easier cleaner way, probably.
    case "PercentAvailableFunds":
      if (order.amountValue < 0) {
        console.warn("Cannot trade negative percentage of available funds: ", order.amountValue)
        return
      }
      const availableValue = accountManagerInfo.summary.find((x: any) => x.text === "Available funds")
      const available = availableValue.wValue.value()
      preOrder.qty = available / orderPrice * order.amountValue
      if (preOrder.qty <= 0) {
        console.warn("Number of shares too small to trade: ", preOrder.qty)
        return
      }
      break
    // To get the size of the position:
    // TradingViewApi.trading()._orderViewController._orderViewModel.symbol 
    // TradingViewApi.trading().activeBroker().positionById("COINBASE:BTCUSD")
    case "PercentPosition":
      if (order.amountValue < 0) {
        console.warn("Cannot trade negative percentage of position: ", order.amountValue)
        return
      }
      const position = await activeBroker.positionById(preOrder.symbol)
      const quantity = position.qty
      preOrder.qty = quantity * order.amountValue
      break
  }

  switch(order.action) {
    case "Buy":
      preOrder.side = 1
      break
    case "Sell":
      preOrder.side = -1
      break
  }

  if(order.roundSharesTo && order.roundSharesTo > 0) {
    if (order.roundSharesTo == 1) {
      preOrder.qty = Math.round(preOrder.qty)
    } else {
      preOrder.qty = Math.round(preOrder.qty / order.roundSharesTo) * order.roundSharesTo
    }
  }

  console.log("Placing order: ", preOrder)
  activeBroker.placeOrder(preOrder)
});