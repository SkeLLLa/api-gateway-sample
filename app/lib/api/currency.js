const client = require('../client');
const { countries } = require('countries-list');

class Currency {
  constructor({ token, prefixUrl }) {
    this.config = { token, prefixUrl };
  }

  async getRates({ country }) {
    const { currency } = countries[country.toUpperCase()];
    const now = new Date().toISOString().split('T').shift();
    const result = await client
      .get(`${now}`, {
        prefixUrl: this.config.prefixUrl,
        searchParams: {
          access_key: this.config.token,
          // base: 'USD',
          symbols: `${currency},USD,GBP,EUR`,
        },
      })
      .json();
    // here could be some mapping
    return result;
  }
}

module.exports = Currency;
