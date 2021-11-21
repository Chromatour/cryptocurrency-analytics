import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { log } from '../../lib/utils/logger';
import marketChartRequest from '../../lib/market-chart-request';
import { DateBody, MarketChart } from '../../types/coingecko.types';
import findHighestVolume from '../../lib/find-highest-volume';

const schema = {
  description: 'Highest trading volume calculator',
  summary: 'Find highest trading volume and volume worth in given range',
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
        tradeDate: {
          type: 'string',
          format: 'date',
        },
        tradeValue: {
          type: 'string',
        },
        unit: {
          type: 'string',
        },
        currency: {
          type: 'string',
        },
      },
    },
  },
};

const handler = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = req.body as DateBody;

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

  const result = findHighestVolume(marketChart);

  reply.send(result);
};

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/highest-volume',
    handler,
    schema,
  });
};
