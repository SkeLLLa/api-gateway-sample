jest.mock('../../client.js');
const client = require('../../client');
const Mail = require('../mail-sender');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe('lib', () => {
  describe('mail', () => {
    const { token, prefixUrl } = { token: 'test', prefixUrl: 'http://test' };
    const mail = new Mail({ token, prefixUrl });
    const { email, name, text, subject } = {
      email: 'foo@bar.baz',
      name: 'foo',
      text: 'bar',
      subject: 'buz',
    };
    test('calls API', async () => {
      await expect(mail.send({ email, name, text, subject })).resolves.toMatchObject({
        sent: true,
      });
      expect(client.post).toBeCalledTimes(1);
      expect(client.post).toBeCalledWith(`mail/send`, {
        prefixUrl,
        headers: {
          authorization: `Bearer ${token}`,
        },
        json: {
          personalizations: [
            {
              to: [
                {
                  email,
                  name,
                },
              ],
              subject,
            },
          ],
          from: {
            email: 'noreply@example.com',
          },
          content: [
            {
              type: 'text/plain',
              value: text,
            },
          ],
        },
      });
    });

    test('forwards error', async () => {
      client.__response__ = new Error('Timeout');
      await expect(mail.send({ email, name, text, subject })).rejects.toEqual(new Error('Timeout'));
      expect(client.post).toBeCalledTimes(1);
    });
  });
});
