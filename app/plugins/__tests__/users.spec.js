jest.mock('../../lib/client.js');

const config = require('config');
const plugin = require('../users');
const client = require('../../lib/client');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('plugins', () => {
  describe('users', () => {
    describe('storePassword', () => {
      client.__response__ = new Error('Timeout');
      test('returns null on error', async () => {
        const mock = {};
        const fastifyMock = {
          decorate: jest.fn().mockImplementation((name, data) => {
            mock[name] = data;
          }),
          log: {
            error: jest.fn(),
          },
        };

        await expect(plugin(fastifyMock, config.get('plugins'))).resolves.toBe(undefined);
        expect(mock.users.storePassword).toBeDefined();
        await expect(
          mock.users.storePassword({ passord: 'xxxyyyzzzz', name: 'foo', email: 'foo@example.com' })
        ).resolves.toEqual({
          json: null,
          mail: null,
          qr: null,
        });
        expect(client.post).toBeCalledTimes(3);
        expect(fastifyMock.log.error).toBeCalledTimes(3);
      });
    });
  });
});
