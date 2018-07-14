const assert = require('assert');
const Fcoin = require('../');

describe('fcoin', function() {
  let fcoin = new Fcoin();
  
  it('should get server time', done => {
    fcoin.getServerTime().then(time => {
      assert(time);
      done();
    });
  });

  it('should get currencies', done => {
    fcoin.getCurrencies().then(currencies => {
      assert(currencies);
      done();
    });
  });
  
  it('should get symbols', done => {
    fcoin.getSymbols().then(symbols => {
      assert(symbols);
      done();
    });
  });

  it('should get tickers', done => {
    fcoin.getTicker('ftbtc').     then(ticker => {
      assert(ticker);
      done();
    });
  });

  it('should get depth', done => {
    fcoin.getDepth('ftbtc', 'L20').then(depth => {
      assert(depth);
      done();
    });
  });
  
  it('should get trades', done => {
    fcoin.getTrades('ftbtc', 100000, 10).then(trades => {
      assert(trades);
      done();
    });
  });

  it('should get candles', done => {
    fcoin.getTrades('ftbtc', 'D1', 100, 100).then(candles => {
      assert(candles);
      done();
    });
  });

  it('should return error calling private api without keys', done => {
    fcoin.getBalance().catch(err => {
      done();
    });
  });
});