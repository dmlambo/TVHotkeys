function buy(amountType, amountValue, priceType, priceValue) {
  if (amountType === "accountPercent") {
    if (value > 1) value = 1
    if (value <= 0) return
  }
  if (amountType === "shares") {
    if (value <= 0) return
    
  }
}

function sell(amountType, amountValue, priceType, priceValue) {
  if (type === "positionPercent") {
    if (value > 1) value = 1
    if (value <= 0) return
    // TradingViewApi.trading()._orderViewController._orderViewModel.symbol 
    // TradingViewApi.trading().activeBroker().positionById("COINBASE:BTCUSD")
  }
  if (type === "shares") {
    if (value <= 0) return
    // TradingViewApi.trading()._orderViewController._orderViewModel
  }
}

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== "TV-hotkeys-extension") return;

  if (event.data.action === "buy") {
    buy(event.data)
  }
  if (event.data.action === "sell") {
    buy(event.data)
  }
});