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
const plugin = require('../../../../plugins/users');
const service = require('../../users/share');
const schema = require('../../users/schema');
const client = require('../../../../lib/client');

server.register(plugin, config.get('plugins'));
server.register(errors, config.get('plugins'));
server.register(schema);
server.register(service, { prefix: '/api/users' });

const pluginConfig = config.get('plugins.users');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('users', () => {
  test('post - share - ok', async () => {
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
    ).resolves.toMatchObject({ body: '{"qr":null,"mail":{"sent":true},"json":null}' });
    expect(client.post).toBeCalledTimes(3);
    expect(client.post).toBeCalledWith('mail/send', {
      prefixUrl: pluginConfig.mailSender.prefixUrl,
      headers: {
        authorization: `Bearer ${pluginConfig.mailSender.token}`,
      },
      json: {
        content: [
          {
            type: 'text/plain',
            value: `Hi, ${data.friend.name}. My password is ${data.password}`,
          },
        ],
        from: {
          email: 'noreply@example.com',
        },
        personalizations: [
          {
            subject: 'My new password',
            to: [
              {
                email: data.friend.email,
                name: data.friend.name,
              },
            ],
          },
        ],
      },
    });
    expect(client.post).toBeCalledWith(`qr/custom`, {
      prefixUrl: pluginConfig.qrCode.prefixUrl,
      headers: {
        host: 'qr-generator.qrcode.studio',
        origin: 'https://www.qrcode-monkey.com',
      },
      json: {
        config: {
          bgColor: '#FFFFFF',
          body: 'leaf',
          eyeBall: 'ball15',
        },
        data: `Hi, ${data.friend.name}. My password is ${data.password}`,
        download: 'imageUrl',
        file: 'png',
        size: 512,
      },
    });
    expect(client.post).toBeCalledWith('items', {
      prefixUrl: pluginConfig.jsonStorage.prefixUrl,
      json: {
        password: data.password,
        whoKnowsPassword: data.friend.name,
      },
    });
  });

  test('post - share - bad request', async () => {
    await expect(
      server.inject({
        method: 'POST',
        url: 'api/users/share-password',
        body: {},
      })
    ).resolves.toMatchObject({
      body:
        '{"statusCode":400,"error":"Bad Request","message":"body should have required property \'password\', body should have required property \'friend\'"}',
    });
  });
});
