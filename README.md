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
    - [Docker](#docker)
      - [Building](#building)
      - [Pre-built images](#pre-built-images)

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

### Docker

#### Building

1. Add credentials as `local.js`
2. Install dependencies (to reduce size use production only deps)
3. Build image via `docker build -t api-gateway-sample .`
4. Run image with command `docker run -it -p 3000:3000 api-gateway-sample`

#### Pre-built images

Built docker images available at https://gitlab.com/m03geek/api-gateway-sample/container_registry/.

Use env variables to pass credentials (those from `local.js`) to container:
`docker run -it -e CALENDAR_TOKEN=foo -e CURRENCY_TOKEN=bar -e MAIL_TOKEN=baz -p 3000:3000 registry.gitlab.com/m03geek/api-gateway-sample:v1.2.0`
