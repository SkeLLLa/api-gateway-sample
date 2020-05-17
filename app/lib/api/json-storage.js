const client = require('../client');

class JSONStorage {
  constructor({ prefixUrl }) {
    this.config = { prefixUrl };
  }

  async saveJSON({ data }) {
    const result = await client
      .post(`items`, {
        prefixUrl: this.config.prefixUrl,
        json: data,
      })
      .json();

    return result ? { uri: result.uri } : null;
  }
}

module.exports = JSONStorage;
