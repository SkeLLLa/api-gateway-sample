const client = require('../client');

class Calendar {
  constructor({ token, prefixUrl }) {
    this.config = { token, prefixUrl };
  }

  async getHolidays({ country }) {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const result = await client
      .get(`holidays`, {
        prefixUrl: this.config.prefixUrl,
        searchParams: {
          api_key: this.config.token,
          year,
          day,
          month,
          country,
        },
      })
      .json();
    return result?.response?.holidays ?? null;
  }
}

module.exports = Calendar;
