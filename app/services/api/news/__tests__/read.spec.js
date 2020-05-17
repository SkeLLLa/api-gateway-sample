const fastify = require('fastify');
const fp = require('fastify-plugin');
const schema = require('../schema');
const service = require('../read');

const getNews = jest.fn().mockReturnValue(
  Promise.resolve({
    holidays: [
      { name: 'holiday 1', description: 'today holiday 1' },
      { name: 'holiday 2', unknownField: 'today holiday 2' },
    ],
    currency: {
      base: 'EUR',
      somethingElse: 'foobar',
      rates: {
        EUR: 1,
        USD: 2,
        UAH: 3,
        GBP: 4,
      },
    },
    health: [
      {
        confirmed: 1,
        deaths: 2,
        recovered: 3,
        active: 4,
        date: '1970-01-01T00:00:00.000Z',
      },
    ],
  })
);

/**
 * @param {import('fastify').FastifyInstance} instance
 */
const plugin = fp(async (instance) => {
  instance.decorate('news', { getNews });
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
  describe('news', () => {
    test('parses query and pass params to plugin', async () => {
      const server = fastify();
      server.register(plugin);
      server.register(errors);
      server.register(schema, { prefix: '/api/news' });
      server.register(service, { prefix: '/api/news' });

      await expect(
        server.inject({
          method: 'GET',
          url: 'api/news',
          query: {
            country: 'UA',
          },
        })
      ).resolves.toMatchObject({
        body: JSON.stringify({
          holidays: [{ name: 'holiday 1', description: 'today holiday 1' }, { name: 'holiday 2' }],
          currency: { base: 'EUR', rates: { EUR: 1, USD: 2, UAH: 3, GBP: 4 } },
          health: [
            {
              confirmed: 1,
              deaths: 2,
              recovered: 3,
              active: 4,
              date: '1970-01-01T00:00:00.000Z',
            },
          ],
        }),
      });

      expect(getNews).toBeCalledWith({ country: 'UA' });
    });
  });
});
