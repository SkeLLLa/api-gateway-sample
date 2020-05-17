const path = require('path');
const baseName = path.basename(__dirname);
const schemaNames = {};

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
async function plugin(fastify, opts) {
  const { prefix } = opts;
  const schemas = {};

  schemas.item = {
    type: 'object',
    description: 'Share result info',
    properties: {
      qr: {
        type: ['object', 'null'],
        properties: {
          url: { type: 'string', format: 'uri' },
        },
      },
      mail: {
        type: ['object', 'null'],
        properties: {
          sent: { type: 'boolean' },
        },
      },
      json: {
        type: ['object', 'null'],
        properties: {
          url: { type: 'string', format: 'uri' },
        },
      },
    },
  };

  schemas.passwordInput = {
    type: 'object',
    description: 'Password info',
    required: ['password', 'friend'],
    properties: {
      password: {
        type: 'string',
        minLength: 8,
        description: 'your secret password to be shared with friend',
      },
      friend: {
        type: 'object',
        description: 'your friend contact info',
        required: ['name', 'email'],
        properties: {
          name: {
            type: 'string',
            description: 'friend name',
          },
          email: {
            type: 'string',
            format: 'email',
            description: `friend's email address`,
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
