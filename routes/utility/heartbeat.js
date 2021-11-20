
const schema = {
  description: 'Alive Check',
  summary: 'Check if server is alive',
  tags: ['Utility'],
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },

        date: {
          type: 'string',
        },
      },
    },
  },
};

const handler = (req, reply) => {
  reply.send({
    status: 'OK',
    date: new Date(),
  });
};

module.exports = {
  method: 'GET',
  url: '/heartbeat',
  handler,
  schema,
};
