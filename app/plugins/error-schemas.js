const fp = require('fastify-plugin');
const httpCode = require('http-status-codes');
const pluginName = require('path').basename(__filename, '.js');
const codeToString = Object.entries(httpCode).reduce((acc, val) => {
  const [str, code] = val;
  if (typeof code === 'number') {
    acc[code] = str;
  }
  return acc;
}, {});

const ERROR_PROPS = {
  code: {
    type: 'number',
    description: 'Error code',
  },
  message: {
    type: 'string',
    description: 'Error message',
  },
};

const errorSchemaNames = {
  ERROR: 'error#', // default error
  DEFAULT: 'error#', // default error
};

function getErrorSchema(code, additionalProps = {}, description) {
  const str = codeToString[code];
  const id = `error.${str}`;
  errorSchemaNames[str] = `${id}#`;
  return {
    $id: id,
    type: 'object',
    description: description || httpCode.getStatusText(code),
    properties: Object.assign({}, ERROR_PROPS, additionalProps),
  };
}

const scemas = [
  getErrorSchema(httpCode.BAD_GATEWAY),
  getErrorSchema(httpCode.BAD_REQUEST, {
    validation: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keyword: { type: 'string' },
          dataPath: { type: 'string' },
          schemaPath: { type: 'string' },
          params: {
            type: 'object',
            additionalProperties: true,
          },
          message: { type: 'string' },
        },
      },
    },
  }),
  getErrorSchema(httpCode.GATEWAY_TIMEOUT),
  getErrorSchema(httpCode.INTERNAL_SERVER_ERROR),
  getErrorSchema(httpCode.NOT_FOUND),
  getErrorSchema(httpCode.SERVICE_UNAVAILABLE),
  getErrorSchema(httpCode.UNSUPPORTED_MEDIA_TYPE),
];

async function errorSchemas(fastify) {
  fastify.decorate('errorSchemas', errorSchemaNames);

  fastify.addSchema({
    $id: `error`,
    type: 'object',
    description: 'Unknown error',
    properties: ERROR_PROPS,
  });
  scemas.forEach((sch) => {
    fastify.addSchema(sch);
  });
}

module.exports = fp(errorSchemas, { name: pluginName });
