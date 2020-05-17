# Sample API gateway

## ToC

- [Sample API gateway](#sample-api-gateway)
  - [ToC](#toc)
  - [Requirements](#requirements)
    - [Used modules](#used-modules)
  - [Usage](#usage)
    - [Available commands](#available-commands)
    - [Credentials](#credentials)
    - [Workflow](#workflow)
    - [Server](#server)

## Requirements

- `node.js` - `>=14.0.0`
- `npm`

### Used modules

- `cacheable-lookup` - https://github.com/szmarczak/cacheable-lookup
- `config` - https://github.com/lorenwest/node-config
- `countries-list` - https://github.com/annexare/Countries
- `fastify` - https://github.com/fastify/fastify
- `fastify-autoload` - https://github.com/fastify/fastify-autoload
- `fastify-oas` - https://github.com/SkeLLLa/fastify-oas
- `fastify-plugin` - https://github.com/fastify/fastify-plugin
- `fastify-status` - https://github.com/SkeLLLa/fastify-status
- `got` - https://github.com/sindresorhus/got
- `http-status-codes` - https://github.com/prettymuchbryce/http-status-codes
- `quick-lru` - https://github.com/sindresorhus/quick-lru
- `under-pressure` - https://github.com/fastify/under-pressure

## Usage

### Available commands

- `npm i` - to install dependencies
- `npm start` - to start server
- `npm test` - to launch tests
- `npm run release` - to tag new release

### Credentials

**NOTE**: To add API credentials to this app set them in `config/local.(js|json|yaml)`.

Or copy provided `local.js` file to `config/` directory.

### Workflow

1. Navigate to prjoect directory.
2. Ensure that your system fits [Requirements](#requirements).
3. Run `npm i`.
4. Setup credentials: e.g. `cp path/to/local.js config/local.js`
5. Run `npm start`.
6. Open http://localhost:3000/api/documentation/index.html or http://localhost:3000/api/documentation/docs.html in your browser.

### Server

Server by default is started on http://localhost:3000.

Documentation is available on http://localhost:3000/api/documentation/index.html and on http://localhost:3000/api/documentation/docs.html.
