import bent from 'bent';
import config from 'config';
import { MarketChart } from '../types/coingecko.types';

const MARKET_CHART_PREFIX: string = config.get('marketChartQueryPrefix');
const REQUEST_URL: string = config.get('requestUrl');
const CURR: string = config.get('currency');
const CRYPT_ID: string = config.get('cryptocurrencyId');

/**
 *
 * @param fromDate day to start search from in UNIX timestamp
 * @param toDate day to search until in UNIX timestamp
 * @returns MarketChart object
 */
const marketChartRequest = async (fromDate: number, toDate: number) => {
  const reqUrl = `${REQUEST_URL}${CRYPT_ID}/${MARKET_CHART_PREFIX}${CURR}&from=${fromDate}&to=${toDate}`;
  const post = bent('GET', 'json', 200);
  const response: MarketChart = await post(reqUrl);

  return response;
};

export default marketChartRequest;
