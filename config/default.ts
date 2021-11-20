module.exports = {
  port: 3002,
  swagger: {
    host: 'localhost:3002',
    schemes: ['http', 'https'],
  },
  routePrefix: '/cryptomarket-analyzer',
  fastifyOptions: {
    logger: false,
    ignoreTrailingSlash: true,
  },
};
