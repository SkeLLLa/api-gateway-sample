jest.mock('../../client.js');
const client = require('../../client');
const Currency = require('../currency');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('lib', () => {
  describe('currency', () => {
    const { token, prefixUrl } = { token: 'test', prefixUrl: 'http://test' };
    const currency = new Currency({ token, prefixUrl });
    const today = new Date().toISOString().split('T').shift();
    test('calls API', async () => {
      await expect(currency.getRates({ country: 'ua' })).resolves.toBe(null);
      expect(client.get).toBeCalledTimes(1);
      expect(client.get).toBeCalledWith(`${today}`, {
        prefixUrl,
        searchParams: {
          access_key: token,
          symbols: 'UAH,USD,GBP,EUR',
        },
      });
    });

    test('forwards error', async () => {
      client.__response__ = new Error('Timeout');
      await expect(currency.getRates({ country: 'ua' })).rejects.toEqual(new Error('Timeout'));
      expect(client.get).toBeCalledTimes(1);
    });
  });
});
