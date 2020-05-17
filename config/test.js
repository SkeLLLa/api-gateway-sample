const config = {};
module.exports = config;

config.env = 'test';

config.httpClient = {
  cache: {
    http: {
      enabled: true,
      size: 100,
    },
    dns: {
      enabled: false,
    },
  },
  timeout: 100,
};

config.plugins = {
  news: {
    calendar: {
      prefixUrl: 'http://calendar',
      token: 'calendar-token',
    },
    health: {
      prefixUrl: 'http://health',
    },
    currency: {
      prefixUrl: 'http://currency',
      token: 'curency-token',
    },
  },
  users: {
    mailSender: {
      prefixUrl: 'http://mail',
      token: 'mail-token',
    },
    qrCode: {
      prefixUrl: 'http://qrcode',
    },
    jsonStorage: {
      prefixUrl: 'http://json',
    },
  },
};
