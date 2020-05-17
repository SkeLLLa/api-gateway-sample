#!/usr/bin/env node
process.env.ALLOW_CONFIG_MUTATIONS = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

/**
 * @type {import('fastify').FastifyInstance}
 */
const { server, onShutdown } = require('../app');
const config = require('config');
const serverConf = config.get('server');
const { name, version } = require('../package.json');

(async () => {
  process.title = `${name}-${version}`;
  process.on('unhandledRejection', (reason) => {
    server.log.error(reason);
  });
  process.on('SIGTERM', onShutdown);

  try {
    await server.ready();
    await server.listen(serverConf.port, serverConf.host);
    server.log.info(`App started. Env: ${config.get('env')}`);
  } catch (ex) {
    server.log.fatal(ex);
    process.exit(1);
  }
})();
