const fp = require('fastify-plugin');
const pluginName = require('path').basename(__filename, '.js');
const JSONStorage = require('../lib/api/json-storage');
const MailSender = require('../lib/api/mail-sender');
const QR = require('../lib/api/qr');

async function users(fastify, { [pluginName]: options }) {
  const handlers = {};
  const jsonStorage = new JSONStorage(options.jsonStorage);
  const mailSender = new MailSender(options.mailSender);
  const qrCode = new QR(options.qrCode);

  async function storePassword({ password, name, email }) {
    const text = `Hi, ${name}. My password is ${password}`;
    const [json, mail, qr] = await Promise.all([
      jsonStorage.saveJSON({ data: { password, whoKnowsPassword: name } }).catch((err) => {
        fastify.log.error(err, 'Failed to save data');
        return null;
      }),
      mailSender
        .send({
          email,
          name,
          text,
          subject: 'My new password',
        })
        .catch((err) => {
          fastify.log.error(err, 'Failed to save data');
          return null;
        }),
      qrCode.text({ text }).catch((err) => {
        fastify.log.error(err, 'Failed to save data');
        return null;
      }),
    ]);
    return { json, mail, qr };
  }
  handlers.storePassword = storePassword;
  fastify.decorate(pluginName, handlers);
}

module.exports = fp(users, { name: pluginName });
