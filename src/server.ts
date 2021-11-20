import * as path from 'path';
import fastifyAutoload from 'fastify-autoload';

const config = require('config');

const fastify = require('fastify');
const fastifySwagger = require('fastify-swagger');

const APP_PORT = config.get('port');
const ROUTE_PREFIX = config.get('routePrefix');
const FASTIFY_OPTIONS = config.get('fastifyOptions');
const SWAGGER_OPTIONS = config.get('swagger');

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
    .register(fastifySwagger, {
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
    })
    .register(fastifyAutoload, {
      dir: path.join(__dirname, 'routes'),
    });

  return {
    start: async () => {
      await server.listen(APP_PORT, '0.0.0.0');
      return server;
    },
  };
};

export default initServer;
