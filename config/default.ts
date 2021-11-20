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
  requestUrl: "https://api.coingecko.com/api/v3/coins/",
  marketChartQueryPrefix: "market_chart/range?",
  currency: "vs_currency=eur",
  cryptocurrencyId: "bitcoin"
};
