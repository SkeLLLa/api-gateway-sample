jest.mock('../../client.js');
const client = require('../../client');
const Currency = require('../health');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('lib', () => {
  describe('health', () => {
    const { token, prefixUrl } = { token: 'test', prefixUrl: 'http://test' };
    const health = new Currency({ token, prefixUrl });
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setUTCHours(0, 0, 0, 0);
    weekAgo.setDate(today.getDate() - 7);
    test('calls API', async () => {
      await expect(health.getReport({ country: 'ua' })).resolves.toBe(null);
      expect(client.get).toBeCalledTimes(1);
      expect(client.get).toBeCalledWith(`country/ua`, {
        prefixUrl,
        searchParams: {
          from: weekAgo.toISOString(),
          to: today.toISOString(),
        },
      });
    });

    test('maps response', async () => {
      client.__response__ = [
        {
          foo: 'bar',
          Baz: 'foo',
          Confirmed: 1,
          Deaths: 2,
          Recovered: 3,
          Active: 4,
          Date: 5,
        },
      ];
      await expect(health.getReport({ country: 'ua' })).resolves.toEqual([
        {
          confirmed: 1,
          deaths: 2,
          recovered: 3,
          active: 4,
          date: 5,
        },
      ]);
      expect(client.get).toBeCalledTimes(1);
    });

    test('forwards error', async () => {
      client.__response__ = new Error('Timeout');
      await expect(health.getReport({ country: 'ua' })).rejects.toEqual(new Error('Timeout'));
      expect(client.get).toBeCalledTimes(1);
    });
  });
});
