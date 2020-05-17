const fastify = require('fastify');
const fp = require('fastify-plugin');
const schema = require('../schema');
const service = require('../share');

const storePassword = jest.fn().mockReturnValue(
  Promise.resolve({
    qr: {
      url: 'http://qr.code/image.png',
      unnecessaryField: 1,
    },
    mail: {
      sent: true,
    },
    json: {
      url: 'http://json.stathem/data.json',
    },
  })
);

/**
 * @param {import('fastify').FastifyInstance} instance
 */
const plugin = fp(async (instance) => {
  instance.decorate('users', { storePassword });
});
const errors = fp(async (instance) => {
  instance.addSchema({
    $id: `error`,
    type: 'object',
    description: 'Unknown error',
    additionalProperties: true,
  });
  instance.decorate('errorSchemas', {
    BAD_REQUEST: 'error#',
    INTERNAL_SERVER_ERROR: 'error#',
    DEFAULT: 'error#',
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('services', () => {
  describe('users', () => {
    test('parses query and pass params to plugin', async () => {
      const server = fastify();
      server.register(plugin);
      server.register(errors);
      server.register(schema, { prefix: '/api/users' });
      server.register(service, { prefix: '/api/users' });
      const data = {
        password: 'super-secret',
        friend: {
          name: 'foobar',
          email: 'foo@example.com',
        },
      };
      await expect(
        server.inject({
          method: 'POST',
          url: '/api/users/share-password',
          body: data,
        })
      ).resolves.toMatchObject({
        body: JSON.stringify({
          qr: {
            url: 'http://qr.code/image.png',
          },
          mail: {
            sent: true,
          },
          json: {
            url: 'http://json.stathem/data.json',
          },
        }),
      });

      expect(storePassword).toBeCalledWith({ password: data.password, ...data.friend });
    });
  });
});
