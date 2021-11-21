import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { log } from '../../lib/utils/logger';
import marketChartRequest from '../../lib/market-chart-request';
import { DateBody, MarketChart } from '../../types/coingecko.types';
import calculateHighestProfits from '../../lib/calculate-highest-profit';

const schema = {
  description: 'Highest profit calculator',
  summary: 'Find the best days for buying and selling for highest profit in given range. Please give two different dates.',
  tags: ['Analytics'],
  body: {
    type: 'object',
    required: ['fromDate', 'toDate'],
    properties: {
      fromDate: {
        type: 'string',
        format: 'date',
      },
      toDate: {
        type: 'string',
        format: 'date',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        buyDate: {
          type: 'string',
          format: 'date',
        },
        sellDate: {
          type: 'string',
          format: 'date',
        },
        sellOrBuy: {
          type: 'boolean',
        },
      },
    },
  },
};

const handler = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = req.body as DateBody;

  // Add 3600 seconds to ensure that the final date is also included in request data
  const fromDate = Math.round(new Date(body.fromDate).getTime() / 1000);
  const toDate = Math.round(new Date(body.toDate).getTime() / 1000) + 3600;

  let marketChart: MarketChart;
  try {
    marketChart = await marketChartRequest(fromDate, toDate);
  } catch (error) {
    log.error('Couldn\'t fetch the market chart from given data range!', error);
    reply.status(500).send({
      status: 'ERROR',
      message: 'Couldn\'t fetch the data!',
    });
    return;
  }

  const result = calculateHighestProfits(marketChart);

  reply.send(result);
};

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/highest-profit',
    handler,
    schema,
  });
};
