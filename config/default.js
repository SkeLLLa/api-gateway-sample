// const { deferConfig } = require('config/defer');
const config = {};
module.exports = config;
const { name, description, version } = require('../package.json');

config.server = {
  port: 3000,
  host: '0.0.0.0',
};

config.fastify = {
  pluginTimeout: 30 * 1000,
  trustProxy: true,
  logger: {
    level: 'info',
    redact: ['req.headers.authorization'],
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          path: req.path,
          parameters: req.parameters,
          headers: req.headers,
          remoteAddress: req.ip,
        };
      },
    },
  },
};

config.httpClient = {
  cache: {
    http: {
      enabled: true,
      size: 100,
    },
    dns: {
      enabled: true,
    },
  },
  timeout: 5 * 1000,
};

config.plugins = {
  'fastify-status': {
    alive: '/__alive__',
    info: '/__info__',
  },
  'under-pressure': {
    maxEventLoopDelay: 1000,
    exposeStatusRoute: '/__ready__',
    message: `Can't handle request`,
    retryAfter: 30,
  },
  'fastify-oas': {
    routePrefix: '/api/documentation',
    addModels: true,
    hideUntagged: true,
    exposeRoute: true,
    openapi: '3.0.2',
    swagger: {
      info: {
        title: name,
        description,
        version,
      },
      tags: [
        { name: 'news', description: 'Recent news from different datasources' },
        { name: 'users', description: 'Manage your user data' },
      ],
      consumes: ['application/json'],
      produces: ['application/json'],
      servers: [
        {
          url: '/',
          description: 'Default server',
        },
      ],
    },
  },
  'news': {
    calendar: {
      prefixUrl: 'https://calendarific.com/api/v2',
    },
    health: {
      prefixUrl: 'https://api.covid19api.com',
    },
    currency: {
      prefixUrl: 'http://data.fixer.io/api',
    },
  },
  'users': {
    mailSender: {
      prefixUrl: 'https://api.sendgrid.com/v3',
    },
    qrCode: {
      prefixUrl: 'https://qr-generator.qrcode.studio',
    },
    jsonStorage: {
      prefixUrl: 'https://jsonstorage.net/api',
    },
  },
};

config.services = {};
