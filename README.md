node-fcoin is a full implementation for FCoin cryptocurrency exchange trading API.

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

fcoin.getTicker('ftusdt').then(console.log);

fcoin.createOrder('ftusdt', 'buy', 'limit', 0.01, 0.01).then(console.log);
```

[Official API Document](https://developer.fcoin.com/en.html)

# Publlic API

The public API does not require passing an API key.

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

# Authenticated API

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