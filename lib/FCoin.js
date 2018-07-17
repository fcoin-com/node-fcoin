const fetch = require('node-fetch');
const crypto = require('crypto');
const querystring = require('querystring');
const WebSocketClient = require('websocket').client;
const EventEmitter = require('events');

const API_BASE_URL = 'https://api.fcoin.com/v2';
const WS_URL = 'wss://api.fcoin.com/v2/ws';

class FCoin extends EventEmitter {
  constructor(config) {
    super();
    this.config = config || {};
  }

  getServerTime() {
    return this.call('GET', `${API_BASE_URL}/public/server-time`);
  }

  getCurrencies() {
    return this.call('GET', `${API_BASE_URL}/public/currencies`);
  }

  getSymbols() {
    return this.call('GET', `${API_BASE_URL}/public/symbols`);
  }

  getTicker(symbol) {
    return this.call('GET', `${API_BASE_URL}/market/ticker/${symbol}`);
  }

  getDepth(symbol, level = 'L20') {
    return this.call('GET', `${API_BASE_URL}/market/depth/${level}/${symbol}`);
  }

  getTrades(symbol, before, limit = 20) {
    return this.call('GET', `${API_BASE_URL}/market/trades/${symbol}`, {before, limit});
  }

  getCandles(symbol, resolution, before, limit = 20) {
    return this.call('GET', `${API_BASE_URL}/market/candles//${resolution}/${symbol}`, {before, limit});
  }

  getBalance() {
    return this.call('GET', `${API_BASE_URL}/accounts/balance`);
  }

  createOrder(symbol, side, type, price, amount) {
    return this.call('POST', `${API_BASE_URL}/orders`, {amount, price, side, symbol, type});
  }

  getOrders(symbol, state, before, after, limit = 20) {
    return this.call('GET', `${API_BASE_URL}/orders`, {after, before, limit, state, symbol});
  }

  getOrder(id) {
    return this.call('GET', `${API_BASE_URL}/orders/${id}`);
  }

  cancelOrder(id) {
    return this.call('POST', `${API_BASE_URL}/orders/${id}/submit-cancel`);
  }

  getOrderMatchResults(id) {
    return this.call('GET', `${API_BASE_URL}/orders/${id}/match-results`);
  }

  connectWebSocket() {
    this.ws = new WebSocketClient();
    this.wsTopics = {};
    this.wsConn = null;
    this.ws.on('connectFailed', () => {
      console.log('connectFailed')
      this.wsconn = null;
      setTimeout(() => this.ws.connect(WS_URL), 10000);
    });
    this.ws.on('connect', conn => {
      this.wsConn = conn;
      for (let topic in this.wsTopics) {
        this.subscribe(topic);
      }
      conn.on('message', message => {
        let data = JSON.parse(message.utf8Data);
        let type = data.type;
        if (/^ticker\./.test(type)) {
          console.log(data)
          let symbol = type.split('.')[1];
          this.emit('ticker', {
            symbol,
            ticker: data.ticker
          });
        } else if (/^depth\./.test(type)) {
          console.log(data)
          let symbol = type.split('.')[2];
          this.emit('depth', {
            symbol,
            depth: {
              asks: data.asks,
              bids: data.bids
            }
          });
        } else if (/^trade\./.test(type)) {
          console.log(data)
          let symbol = type.split('.')[1];
          this.emit('trade', {
            symbol,
            ts: data.ts,
            trade: {
              id: data.id,
              side: data.side,
              price: data.price,
              amount: data.amount
            }
          });
        }
      });
      conn.on('close', () => { 
        console.log('close')
        this.wsConn = null;
        if (this.ws) {
          setTimeout(() => this.ws.connect(WS_URL), 10000);
        }
      });
      conn.on('error', () => { 
      });
    });
    this.ws.connect(WS_URL);
  }

  disconnectWebSocket() {
    this.ws = null;
    this.wsConn.close();
  }

  subscribeTicker(symbol) {
    this.subscribe(`ticker.${symbol}`);
  }

  subscribeDepth(symbol, level = 'L20') {
    this.subscribe(`depth.${level}.${symbol}`);
  }

  subscribeTrade(symbol) {
    this.subscribe(`trade.${symbol}`);
  }

  unsubscribeTicker(symbol) {
    this.unsubscribe(`ticker.${symbol}`);
  }

  unsubscribeDepth(symbol, level = 'L20') {
    this.unsubscribe(`depth.${level}.${symbol}`);
  }

  unsubscribeTrade(symbol) {
    this.unsubscribe(`trade.${symbol}`);
  }

  call(method, url, qs) {
    qs = qs || {};

    let time = Date.now();
    let signature = undefined;
    if (this.config.key && this.config.secret)
      signature = this.sign(method, url, time, qs)
    
    return new Promise((resolve, reject) => {
      fetch(`${url}?${querystring.stringify(qs)}`, {
        method: method,
        headers: {
          'FC-ACCESS-KEY': this.config.key,
          'FC-ACCESS-SIGNATURE': signature,
          'FC-ACCESS-TIMESTAMP': time,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      .then(res => {
        return res.json();
      }).then(res => {
        if (res.status == 0) {
          resolve(res.data);
        } else {
          reject(new Error(`FCoin error ${res.status} ${res.msg}`));
        }
      })
      .catch(err => reject(err));
    }); 
  }

  sign(method, url, time, qs) {
    let data = `${method}${url}${time}${querystring.stringify(qs)}`
    data = Buffer.from(data).toString('base64');
    let signature = crypto
      .createHmac('sha1', this.config.secret)
      .update(data)
      .digest()
      .toString('base64');
    return signature;
  }

  subscribe(topic) {
    this.wsTopics[topic] = new Date();
    if (this.wsConn) {
      this.wsConn.send(JSON.stringify({
        cmd: 'sub',
        args: [topic]
      }));
    }
  }

  unsubscribe(topic) {
    delete this.wsTopics[topic];
    if (this.wsConn) {
      this.wsConn.send(JSON.stringify({
        cmd: 'unsub',
        args: [topic]
      }));
    }
  }
}

module.exports = FCoin;
