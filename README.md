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

## getServerTime()

## getCurrencies()

## getSymbols()

## getTicker(symbol)

## getDepth(symbol, level = 'L20')

## getTrades(symbol, before, limit = 20)

## getCandles(symbol, resolution, before, limit = 20)

# Authenticated API

## getBalance()

## createOrder(symbol, side, type, price, amount

## getOrders(symbol, state, before, after, limit = 20)

## getOrder(id)

## cancelOrder(id)

## getOrderMatchResults(id)
