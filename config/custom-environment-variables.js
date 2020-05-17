const config = {};
module.exports = config;

config.plugins = {
  news: {
    calendar: {
      token: 'CALENDAR_TOKEN',
    },
    currency: {
      token: 'CURRENCY_TOKEN',
    },
  },
  users: {
    mailSender: {
      token: 'MAIL_TOKEN',
    },
  },
};
