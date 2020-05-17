const path = require('path');
const baseName = path.basename(__dirname);
const { countries } = require('countries-list');
const schemaNames = {};

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
async function plugin(fastify, opts) {
  const { prefix } = opts;
  const schemas = {};

  schemas.search = {
    type: 'object',
    description: 'News search query',
    required: ['country'],
    properties: {
      country: { type: 'string', enum: Object.keys(countries), description: 'country code' },
    },
  };

  schemas.item = {
    type: 'object',
    description: 'News about holidays, currency and health',
    properties: {
      holidays: {
        type: ['array', 'null'],
        description: 'current day holidays',
        items: {
          type: 'object',
          description: 'holidays list',
          properties: {
            name: { type: 'string', description: 'holiday name' },
            description: { type: 'string', description: 'holiday description' },
          },
        },
      },
      currency: {
        type: ['object', 'null'],
        description: 'currency rates info',
        properties: {
          base: { type: 'string', description: 'country currency' },
          rates: {
            type: 'object',
            description: 'rates',
            additionalProperties: {
              type: 'number',
            },
          },
        },
      },
      health: {
        type: ['array', 'null'],
        description: 'country covid health info for last week',
        items: {
          type: 'object',
          description: 'daily stats',
          properties: {
            confirmed: { type: 'number', description: 'daily confirmed cases' },
            deaths: { type: 'number', description: 'daily confirmed deaths' },
            recovered: { type: 'number', description: 'daily recovered people' },
            active: { type: 'number', description: 'daily active cases count' },
            date: { type: 'string', description: 'date', format: 'date-time' },
          },
        },
      },
    },
  };

  for (const [key, val] of Object.entries(schemas)) {
    const id = [prefix, key].join('/');
    schemaNames[key] = `${id}#`;
    fastify.addSchema({
      $id: id,
      description: `${key} schema`,
      ...val,
    });
  }
}

module.exports = plugin;
module.exports[Symbol.for('plugin-meta')] = {
  name: `schema-${baseName}`,
};
module.exports[Symbol.for('skip-override')] = true;
module.exports.schemas = schemaNames;
