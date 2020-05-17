const client = require('../client');

class QRGenerator {
  constructor({ prefixUrl }) {
    this.config = { prefixUrl };
  }

  async text({ text }) {
    const result = await client
      .post(`qr/custom`, {
        prefixUrl: this.config.prefixUrl,
        headers: {
          host: 'qr-generator.qrcode.studio',
          origin: 'https://www.qrcode-monkey.com',
        },
        json: {
          config: {
            bgColor: '#FFFFFF',
            body: 'leaf',
            eyeBall: 'ball15',
          },
          data: text,
          download: 'imageUrl',
          file: 'png',
          size: 512,
        },
      })
      .json();

    return result ? { url: `https:${result.imageUrl}` } : null;
  }
}

module.exports = QRGenerator;
