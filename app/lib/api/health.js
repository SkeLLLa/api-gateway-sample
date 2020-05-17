const client = require('../client');

class Health {
  constructor({ prefixUrl }) {
    this.config = { prefixUrl };
  }

  async getReport({ country }) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setUTCHours(0, 0, 0, 0);
    weekAgo.setDate(today.getDate() - 7);

    const result = await client
      .get(`country/${country}`, {
        prefixUrl: this.config.prefixUrl,
        searchParams: {
          from: weekAgo.toISOString(),
          to: today.toISOString(),
        },
      })
      .json();
    return (
      result?.map((it) => {
        return {
          confirmed: it.Confirmed,
          deaths: it.Deaths,
          recovered: it.Recovered,
          active: it.Active,
          date: it.Date,
        };
      }) ?? null
    );
  }
}

module.exports = Health;
