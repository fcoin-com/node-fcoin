node-fcoin is a full implementation for FCoin cryptocurrency exchange REST and WebSocket trading API.

# Installation

```
npm install node-fcoin
```

# Get Started

```javascript
const FCoin = require('node-fcoin');

let fcoin = new FCoin({
    key: 'YOUR API KEY',
    secret: 'YOUR API SECRET'
});

// Rest API
fcoin.getTicker('ftusdt').then(data => {
    console.log(data);
});

fcoin.createOrder('ftusdt', 'buy', 'limit', 0.01, 0.01).then(data => {
    console.log(data);
});

// WebSocket API
fcoin.connectWebSocket();

fcoin.subscribeTicker('btcusdt');

fcoin.on('ticker', data => {
  console.log(data);
  fcoin.disconnectWebSocket();
});
```

[Official API Document](https://developer.fcoin.com/en.html)

# Publlic REST API

## getServerTime()

Gets server time.

## getCurrencies()

Gets available currencies.

## getSymbols()

Gets available trading pairs.

## getTicker(symbol)

Gets ticker data.

## getDepth(symbol, level = 'L20')

Gets market depth data.

## getTrades(symbol, before, limit = 20)

Gets recent market trades.

## getCandles(symbol, resolution, before, limit = 20)

Gets OHLCV data.

# Authenticated REST API

The authenticated API requires an API key applied from the settings page. 

## getBalance()

## createOrder(symbol, side, type, price, amount)

Creates a new order.

## getOrders(symbol, state, before, after, limit = 20)

Gets orders.

## getOrder(id)

Gets the order with specified id.

## cancelOrder(id)

Cancels the order with specified id.

## getOrderMatchResults(id)

Gets match result for the order with specified id.

# Public Market Data WebSocket API

## connectWebSocket()

Connects to the web socket server. It will try to reconnect and restore all subscriptions if connection is lost.

## disconnectWebSocket()

Disconnects from the web socket server.

## subscribeTicker(symbol)

Subscribes to ticker updates.

## subscribeDepth(symbol, level = 'L20')

Subscribes to market depth updates.

## subscribeTrade(symbol)

Subscribes to trade updates.

## unsubscribeTicker(symbol)

Unsubscribes ticker updates.

## unsubscribeDepth(symbol, level = 'L20')

Unsubscribes market depth updates.

## unsubscribeTrade(symbol)

Unsubscribes trade updates.

## on('ticker', data)

Ticker update event.

## on('depth', data)

Market depth update event.

## on('trade', data)

Trade update event.
