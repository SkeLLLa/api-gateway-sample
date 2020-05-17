/**
 * This is quiet bad due to deps and requires.
 * But it's always good point to start and test
 * everything with minimum mocks.
 *
 * Left it here just to help you understand the flow better.
 */

jest.mock('../../../../lib/client');

const fastify = require('fastify');
const config = require('config');
const server = fastify();
const errors = require('../../../../plugins/error-schemas');
const plugin = require('../../../../plugins/news');
const service = require('../../news/read');
const schema = require('../../news/schema');
const client = require('../../../../lib/client');

server.register(plugin, config.get('plugins'));
server.register(errors, config.get('plugins'));
server.register(schema);
server.register(service, { prefix: '/api/news' });

const pluginConfig = config.get('plugins.news');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('news', () => {
  test('get - ok', async () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    await expect(
      server.inject({
        method: 'GET',
        url: 'api/news',
        query: {
          country: 'UA',
        },
      })
    ).resolves.toMatchObject({ body: '{"holidays":null,"currency":null,"health":null}' });
    expect(client.get).toBeCalledTimes(3);
    expect(client.get).toBeCalledWith('country/UA', {
      prefixUrl: pluginConfig.health.prefixUrl,
      searchParams: {
        to: expect.stringMatching(new RegExp(`^${year}-${month}-${day}T00:00:00.000Z$`)),
        from: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T00:00:00.000Z$/),
      },
    });
    expect(client.get).toBeCalledWith(`${year}-${month}-${day}`, {
      prefixUrl: pluginConfig.currency.prefixUrl,
      searchParams: {
        access_key: pluginConfig.currency.token,
        symbols: 'UAH,USD,GBP,EUR',
      },
    });
    expect(client.get).toBeCalledWith('holidays', {
      prefixUrl: pluginConfig.calendar.prefixUrl,
      searchParams: {
        api_key: pluginConfig.calendar.token,
        country: 'UA',
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });
  });

  test('get - bad request', async () => {
    await expect(
      server.inject({
        method: 'GET',
        url: 'api/news',
        query: {},
      })
    ).resolves.toMatchObject({
      body:
        '{"statusCode":400,"error":"Bad Request","message":"querystring should have required property \'country\'"}',
    });
  });
});
