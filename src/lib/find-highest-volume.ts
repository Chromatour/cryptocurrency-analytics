import config from 'config';
import { MarketChart } from '../types/coingecko.types';
import calcAverage from './utils/average';
import numberFormatter from './utils/number-formatter';

const currency: string = config.get('currency');

/**
 * Finds the highest volume day in given range
 * @param marketChart data to be analysed
 * @returns object that includes date that had the highest volume,
 * its value, unit(order of magnitude prefix used with currencies) and currency
 */
const findHighestVolume = (marketChart: MarketChart) => {
  const { prices, tradingVolumes } = marketChart;

  // First find the highest volume and corresponding date in given range
  const volumes = tradingVolumes.map((day) => day[1]);
  const highestVolume = Math.max(...volumes);
  const indexOfHighest = volumes.indexOf(highestVolume);
  const highestDate = tradingVolumes[indexOfHighest][0];

  // Calculate average price for found date
  const dateAndPrices = prices.filter((price) => price[0] >= highestDate
  && price[0] < (highestDate + 24 * 60 * 60 * 1000));
  const dayPrices = dateAndPrices.map((day) => day[1]);
  const averagePriceForDay = calcAverage(dayPrices);

  // Calculate trade volume's value with average price
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
