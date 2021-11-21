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

  // Check if input is valid
  if (body.fromDate === body.toDate) {
    log.info('User input duplicate dates');

    reply.status(400).send({
      status: 'Bad Request',
      message: 'The given dates are the same! Please give two different dates.',
    });
    return;
  }
  let fromDate: Date = new Date(body.fromDate);
  let toDate: Date = new Date(body.toDate);

  // Swap dates if given in wrong order
  if (fromDate > toDate) {
    [fromDate, toDate] = [toDate, fromDate];
  }

  // Add 3600 seconds to ensure that the final date is also included in request data
  const fromDateUnix = Math.round(fromDate.getTime() / 1000);
  const toDateUnix = Math.round(toDate.getTime() / 1000) + 3600;

  let marketChart: MarketChart;
  try {
    marketChart = await marketChartRequest(fromDateUnix, toDateUnix);
  } catch (error) {
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
