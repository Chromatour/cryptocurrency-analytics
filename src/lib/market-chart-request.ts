import bent from 'bent';
import config from 'config';
import { MarketChart } from '../types/coingecko.types';

const CURR: string = config.get('currency');
const CRYPT_ID: string = config.get('cryptocurrencyId');
const get = bent('GET', 'json', 200);

/**
 *
 * @param fromDate day to start search from in UNIX timestamp
 * @param toDate day to search until in UNIX timestamp
 * @returns MarketChart object
 */
const marketChartRequest = async (fromDate: number, toDate: number) => {
  const reqUrl = `https://api.coingecko.com/api/v3/coins/${CRYPT_ID}/market_chart/range?vs_currency=${CURR}&from=${fromDate}&to=${toDate}`;
  const response: MarketChart = await get(reqUrl);

  return response;
};

export default marketChartRequest;
