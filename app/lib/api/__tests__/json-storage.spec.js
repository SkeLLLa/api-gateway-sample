jest.mock('../../client.js');
const client = require('../../client');
const JSONStorage = require('../json-storage');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('lib', () => {
  describe('json', () => {
    const { token, prefixUrl } = { token: 'test', prefixUrl: 'http://test' };
    const json = new JSONStorage({ token, prefixUrl });
    const data = { foo: 'bar' };
    test('calls API', async () => {
      await expect(json.saveJSON({ data })).resolves.toBe(null);
      expect(client.post).toBeCalledTimes(1);
      expect(client.post).toBeCalledWith(`items`, {
        prefixUrl,
        json: {
          ...data,
        },
      });
    });

    test('maps response', async () => {
      client.__response__ = {
        uri: 'http:://foo.bar',
        extra: 'baz',
      };
      await expect(json.saveJSON({ data })).resolves.toEqual({ uri: 'http:://foo.bar' });
      expect(client.post).toBeCalledTimes(1);
    });

    test('forwards error', async () => {
      client.__response__ = new Error('Timeout');
      await expect(json.saveJSON({ data })).rejects.toEqual(new Error('Timeout'));
      expect(client.post).toBeCalledTimes(1);
    });
  });
});
