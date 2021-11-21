import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { log } from '../../lib/utils/logger';
import calculateDownwardTrend from '../../lib/calculate-downward-trend';
import marketChartRequest from '../../lib/market-chart-request';
import { DateBody, MarketChart } from '../../types/coingecko.types';

const schema = {
  description: 'Downward trend calculator',
  summary: 'Calculate longest downward trend between given days. Please give two different dates.',
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
        beginDate: {
          type: 'string',
          format: 'date',
        },
        endDate: {
          type: 'string',
          format: 'date',
        },
        numberOfDays: {
          type: 'number',
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

  const longestTimeFrame = calculateDownwardTrend(marketChart);

  reply.send(longestTimeFrame);
};

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/downward-trend',
    handler,
    schema,
  });
};
