import config from 'config';
import { MarketChart } from '../types/coingecko.types';
import calcAverage from './utils/average';
import numberFormatter from './utils/number-formatter';

const currency: string = config.get('currency');

const findHighestVolume = (marketChart: MarketChart) => {
  const { prices } = marketChart;
  const tradingVolumes = marketChart.total_volumes;

  // First find highest volume in given range
  const volumes = tradingVolumes.map((day) => day[1]);
  const highestVolume = Math.max(...volumes);
  const indexOfHighest = volumes.indexOf(highestVolume);
  const highestDate = tradingVolumes[indexOfHighest][0];

  // Calculate average price for found date
  const dateAndPrices = prices.filter((price) => price[0] >= highestDate
  && price[0] < (highestDate + 24 * 60 * 60 * 1000));
  const dayPrices = dateAndPrices.map((day) => day[1]);
  const averagePriceForDay = calcAverage(dayPrices);

  // Calculate volume in currency with average price
  const valueWithUnit = numberFormatter(averagePriceForDay * highestVolume);
  const result: { tradeDate: Date, tradeValue: string, unit: string, currency: string } = {
    tradeDate: new Date(tradingVolumes[indexOfHighest][0]),
    tradeValue: valueWithUnit.value,
    unit: valueWithUnit.unit,
    currency,
  };
  return result;
};

export default findHighestVolume;
