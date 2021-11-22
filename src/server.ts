import * as path from 'path';
import fastifyAutoload from 'fastify-autoload';
import { FastifyReply, FastifyRequest, FastifyError } from 'fastify';
import { log } from './lib/utils/logger';

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
          title: 'Cryptocurrency market analytics API',
          description: 'Cryptocurrency market analytics API made for Vincit Rising Star -program',
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
    // Register automatically all endpoints from routes -folder
    .register(fastifyAutoload, {
      dir: path.join(__dirname, 'routes'),
    })
    .setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      log.error({
        error: error.name,
        message: error.message,
        url: request.url,
        method: request.method,
        body: request.body,
        stack: error.stack,
      });

      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Internal Server Error',
      });
    });

  return {
    start: async () => {
      await server.listen(APP_PORT, '0.0.0.0');
      return server;
    },
  };
};

export default initServer;
