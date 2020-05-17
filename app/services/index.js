const autoload = require('fastify-autoload');
const fs = require('fs').promises;
const path = require('path');

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
async function services(fastify, opts) {
  const files = await fs.readdir(__dirname);
  const fStats = await Promise.all(
    files.map((file) => {
      return fs.stat(path.join(__dirname, file));
    })
  );
  fStats.forEach((stat, index) => {
    if (stat.isDirectory()) {
      const file = files[index];
      const name = path.basename(file);
      fastify.register(autoload, {
        dir: path.join(__dirname, file),
        options: { prefix: `/${name}/`, ...opts[name] },
      });
    }
  });
}

module.exports = services;
