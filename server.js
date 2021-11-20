const config = require('config');

const fastify = require('fastify');
const fastifySwagger = require('fastify-swagger');
const routes = require('./routes');

const APP_PORT = config.get('port')
const ROUTE_PREFIX = config.get('routePrefix');
const FASTIFY_OPTIONS = config.get('fastifyOptions');
const SWAGGER_OPTIONS = config.get('swagger');

const initSwagger = () => {
  return {
    routePrefix: `${ROUTE_PREFIX}/documentation`,
    swagger: {
      info: {
        title: 'Project Vincit Rising Star backend',
        description: 'Vincit Rising Star Cryptocurrency market analyzer backend service',
        version: '1.0.0',
      },
      host: SWAGGER_OPTIONS.host,
      schemes: SWAGGER_OPTIONS.schemes,
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: 'Analytics',
          description: 'Market analytics endpoints',
        }, {
          name: 'Utility',
          description: 'Utility endpoints',
        },
      ],
    },
    exposeRoute: true,
  };
}

/**
 * Routes
 * Loop through all routes and add them to under correct prefixes
 */

const utilityRoute = async (server) => {
  Object.keys(routes.utility).forEach((key) => {
    server.route(routes.utility[key]);
  });
};

const analyticsRoute = async (server) => {
  Object.keys(routes.analytics).forEach((key) => {
    server.route(routes.analytics[key]);
  });
};

/**
 * Init server
 */
 const initServer = async () => {
  const server = fastify({
    logger: FASTIFY_OPTIONS.logger,
    ignoreTrailingSlash: FASTIFY_OPTIONS.ignoreTrailingSlash,
    ajv: {
      customOptions: {
        removeAdditional: 'all', // Remove additional parameters from the body
      },
    },
  });

  // Register plugins and routes
  server
    .register(fastifySwagger, initSwagger())
    .register(utilityRoute, { prefix: `${ROUTE_PREFIX}/utility` })
    .register(analyticsRoute, { prefix: `${ROUTE_PREFIX}/analytics` })

  return {
    start: async () => {
      await server.listen(APP_PORT, '0.0.0.0');
      return server;
    },
  };
};

module.exports = {
  initServer,
};
