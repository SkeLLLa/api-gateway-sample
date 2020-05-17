const httpCode = require('http-status-codes');
const path = require('path');
// @ts-ignore
const { schemas } = require('./schema');
const schemaPlugin = `schema-${path.basename(__dirname)}`;

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
module.exports = async function (fastify) {
  const { users, errorSchemas } = fastify;

  /**
   * @param {import('fastify').FastifyRequest} request
   */
  async function share(request) {
    const {
      password,
      friend: { name, email },
    } = request.body;
    const data = await users.storePassword({ password, name, email });
    return data;
  }

  fastify.post(
    '/share-password',
    {
      schema: {
        description: `Sends your password`,
        tags: ['users'],
        summary: 'Share your password with your friends via email, json and qr code',
        body: schemas.passwordInput,
        response: {
          [httpCode.OK]: schemas.item,
          [httpCode.BAD_REQUEST]: errorSchemas.BAD_REQUEST,
          [httpCode.INTERNAL_SERVER_ERROR]: errorSchemas.INTERNAL_SERVER_ERROR,
          default: errorSchemas.DEFAULT,
        },
      },
    },
    share
  );
};

// This allows to load schemas first
module.exports[Symbol.for('plugin-meta')] = {
  dependencies: [schemaPlugin],
};
