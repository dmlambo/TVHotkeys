import { Order } from "./hotkeys"

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== "TV-hotkeys-extension") return;

  const order = event.data as Order

  // To execute: 
  // foo = TradingViewApi.trading()._orderViewController._orderViewModel.preOrder()
  //  ... modify ... 
  // TradingViewApi.trading().activeBroker().placeOrder(foo) 
  // type == 1 = limit
  // type == 2 = market
  // type == 3 = stop
  switch(order.action) {
    case "Buy":
      switch(order.amountMode) {
        case "Shares":
          break
        case "Percent":
          break
      }
      break
    // To get the size of the position:
    // TradingViewApi.trading()._orderViewController._orderViewModel.symbol 
    // TradingViewApi.trading().activeBroker().positionById("COINBASE:BTCUSD")
    case "Sell":
      switch(order.amountMode) {
        case "Shares":
          break
        case "Percent":
          break
      }
      break
  }
});