const fetch = require('node-fetch');
const crypto = require('crypto');
const querystring = require('querystring');

const API_BASE_URL = "https://api.fcoin.com/v2"

class FCoin {
  constructor(config) {
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
        console.log(res)
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
}

module.exports = FCoin;
