jest.mock('../../client.js');
const client = require('../../client');
const Calendar = require('../calendar');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});
describe('lib', () => {
  describe('calendar', () => {
    const { token, prefixUrl } = { token: 'test', prefixUrl: 'http://test' };
    const cal = new Calendar({ token, prefixUrl });
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    test('calls API', async () => {
      await expect(cal.getHolidays({ country: 'ua' })).resolves.toBe(null);
      expect(client.get).toBeCalledTimes(1);
      expect(client.get).toBeCalledWith('holidays', {
        prefixUrl,
        searchParams: { api_key: token, country: 'ua', day, month, year },
      });
    });

    test('maps response', async () => {
      client.__response__ = {
        response: {
          holidays: [{ name: 'foo' }],
          otherStuff: 'bar',
        },
      };
      await expect(cal.getHolidays({ country: 'ua' })).resolves.toEqual([{ name: 'foo' }]);
      expect(client.get).toBeCalledTimes(1);
    });

    test('forwards error', async () => {
      client.__response__ = new Error('Timeout');
      await expect(cal.getHolidays({ country: 'ua' })).rejects.toEqual(new Error('Timeout'));
      expect(client.get).toBeCalledTimes(1);
    });
  });
});
