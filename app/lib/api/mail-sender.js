const client = require('../client');

class MailSender {
  constructor({ prefixUrl, token }) {
    this.config = { prefixUrl, token };
  }

  async send({ email, name, text, subject }) {
    await client.post(`mail/send`, {
      prefixUrl: this.config.prefixUrl,
      headers: {
        authorization: `Bearer ${this.config.token}`,
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

    return { sent: true };
  }
}

module.exports = MailSender;
