const fp = require('fastify-plugin');
const pluginName = require('path').basename(__filename, '.js');
const Calendar = require('../lib/api/calendar');
const Currency = require('../lib/api/currency');
const Health = require('../lib/api/health');

async function news(fastify, { [pluginName]: options }) {
  const handlers = {};
  const health = new Health(options.health);
  const currency = new Currency(options.currency);
  const calendar = new Calendar(options.calendar);

  async function getNews({ country }) {
    const [healthData, currencyData, holidaysData] = await Promise.all([
      health.getReport({ country }).catch((err) => {
        fastify.log.error(err, 'Failed to get data');
        return null;
      }),
      currency.getRates({ country }).catch((err) => {
        fastify.log.error(err, 'Failed to get data');
        return null;
      }),
      calendar.getHolidays({ country }).catch((err) => {
        fastify.log.error(err, 'Failed to get data');
        return null;
      }),
    ]);
    return {
      holidays: holidaysData,
      health: healthData,
      currency: currencyData,
    };
  }
  handlers.getNews = getNews;
  fastify.decorate(pluginName, handlers);
}

module.exports = fp(news, { name: pluginName });
