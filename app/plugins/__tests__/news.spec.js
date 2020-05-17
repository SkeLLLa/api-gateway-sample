jest.mock('../../lib/client.js');

const config = require('config');
const plugin = require('../news');
const client = require('../../lib/client');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('plugins', () => {
  describe('news', () => {
    describe('getNews', () => {
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
        expect(mock.news.getNews).toBeDefined();
        await expect(mock.news.getNews({ country: 'UA' })).resolves.toEqual({
          currency: null,
          health: null,
          holidays: null,
        });
        expect(client.get).toBeCalledTimes(3);
        expect(fastifyMock.log.error).toBeCalledTimes(3);
      });
    });
  });
});
