const httpCode = require('http-status-codes');
const path = require('path');
// @ts-ignore
const { schemas } = require('./schema');
const schemaPlugin = `schema-${path.basename(__dirname)}`;

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
module.exports = async function (instance) {
  const { errorSchemas, news } = instance;

  /**
   * @param {import('fastify').FastifyRequest} request
   */
  async function getNews(request) {
    const { country } = request.query;
    const data = await news.getNews({ country });
    return data;
  }

  instance.get(
    '/',
    {
      schema: {
        description: `Gets recent news and info by country`,
        tags: ['news'],
        summary: 'Returns actual currency rates, holidays and health data in selected country',
        querystring: schemas.search,
        response: {
          [httpCode.OK]: schemas.item,
          [httpCode.BAD_REQUEST]: errorSchemas.BAD_REQUEST,
          [httpCode.INTERNAL_SERVER_ERROR]: errorSchemas.INTERNAL_SERVER_ERROR,
          default: errorSchemas.DEFAULT,
        },
      },
    },
    getNews
  );
};

// This allows to load schemas first
module.exports[Symbol.for('plugin-meta')] = {
  dependencies: [schemaPlugin],
};
