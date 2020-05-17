const server = require('fastify');
const path = require('path');
const httpCode = require('http-status-codes');
const config = require('config');
const plugins = [
  // exposes alive route that is used to detect whether service is running or not
  { plugin: require('fastify-status'), options: config.get('plugins.fastify-status') },
  // exposes readiness route that shows if service is ready to handle requests
  // e.g. under heavy load this will return error and loadbalancer can redirect traffic to less loaded instance
  { plugin: require('under-pressure'), options: config.get('plugins.under-pressure') },
  // generates OpenAPI docs
  { plugin: require('fastify-oas'), options: config.get('plugins.fastify-oas') },
  // loads plugins files from directory
  {
    plugin: require('fastify-autoload'),
    options: { dir: path.join(__dirname, 'plugins'), options: config.get('plugins') },
  },
  // server services (each folder could be easily separated to standalone service if needed)
  // and vise-versa if we need to join services into one they could be put into that dir
  { plugin: require('./services'), options: config.get('services') },
];

const fastify = server({ ...config.get('fastify') });

for (const p of plugins) {
  fastify.register(p.plugin, p.options);
}

// usually this goes as node module (plugin) and it's tested as separate module
// so no test for it here
async function errorHander(error, request, reply) {
  let code;
  if (typeof error.code === 'string') {
    code = httpCode.INTERNAL_SERVER_ERROR;
  }

  code = error.statusCode || code || reply.res.statusCode || httpCode.INTERNAL_SERVER_ERROR;

  const info = {
    headers: request.headers,
    method: request.raw.method,
    ips: request.raw.ips,
    ip: request.raw.ip,
    url: request.raw.url,
    code: code,
  };

  if (request.body) {
    info.body = request.body || request.raw.body;
  }
  if (request.query) {
    info.query = request.query;
  }
  if (request.params) {
    info.params = request.params;
  }

  error.context = error.context ? { ...error.context, ...info } : info;

  if (code >= httpCode.INTERNAL_SERVER_ERROR) {
    fastify.log.error(error);
  } else {
    fastify.log.warn(error);
  }

  const response = { code, message: error.message };
  if (error.validation) {
    response.validation = error.validation;
  }
  reply.code(code).send(response);
}

fastify.setErrorHandler(errorHander);

function exitHandler() {
  return Promise.race([
    new Promise((resolve) => {
      setTimeout(resolve, 10000);
    }),
    async () => {
      await fastify.close();
    },
  ])
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      fastify.log.error(err);
      process.exit(1);
    });
}

module.exports = { server: fastify, onShutdown: exitHandler };
