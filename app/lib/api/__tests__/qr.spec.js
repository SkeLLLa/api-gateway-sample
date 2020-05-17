jest.mock('../../client.js');
const client = require('../../client');
const QR = require('../qr');

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
    const qr = new QR({ token, prefixUrl });
    const text = 'foobar';
    test('calls API', async () => {
      await expect(qr.text({ text })).resolves.toBe(null);
      expect(client.post).toBeCalledTimes(1);
      expect(client.post).toBeCalledWith(
        `qr/custom`,
        expect.objectContaining({
          prefixUrl,
          json: expect.objectContaining({
            data: text,
          }),
        })
      );
    });

    test('maps response', async () => {
      client.__response__ = {
        imageUrl: '//foo.bar',
        extra: 'baz',
      };
      await expect(qr.text({ text })).resolves.toEqual({ url: 'https://foo.bar' });
      expect(client.post).toBeCalledTimes(1);
    });

    test('forwards error', async () => {
      client.__response__ = new Error('Timeout');
      await expect(qr.text({ text })).rejects.toEqual(new Error('Timeout'));
      expect(client.post).toBeCalledTimes(1);
    });
  });
});
