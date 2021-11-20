import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { log } from '../../lib/logger';
import calculateDownwardTrend from '../../lib/calculate-downward-trend';
import marketChartRequest from '../../lib/market-chart-request';
import { DateBody, MarketChart } from '../../types/coingecko.types';

const schema = {
  description: 'Downward trend calculator',
  summary: 'Calculate longest downward trend between given days',
  tags: ['Analytics'],
  body: {
    type: 'object',
    required: ['fromDate', 'toDate'],
    properties: {
      fromDate: {
        type: 'string',
        format: 'date-time',
      },
      toDate: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        beginDate: {
          type: 'string',
          format: 'date-time',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
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
  const fromDate = Math.round(new Date(body.fromDate).getTime() / 1000);
  const toDate = Math.round(new Date(body.toDate).getTime() / 1000);
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
