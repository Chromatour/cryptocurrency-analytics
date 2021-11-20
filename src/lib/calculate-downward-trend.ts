/* eslint-disable no-restricted-syntax */
import { MarketChart } from '../types/coingecko.types';

const calculateDownwardTrend = async (marketChart: MarketChart) => {
  const { prices } = marketChart;
  let beginningDate: [number, number] = [0, 0];
  let endingDate: [number, number] = [0, 0];
  let longestTimeFrame: [number, number] = [0, 0];
  let previousDate: [number, number] = [0, 0];
  for (const price of prices) {
    if (price[1] > previousDate[1]) {
      endingDate = [price[0], price[1]];
      if (beginningDate[1] !== 0 && (endingDate[0] - beginningDate[0])
        > (longestTimeFrame[1] - longestTimeFrame[0])) {
        longestTimeFrame = [beginningDate[0], endingDate[0]];
      }
      beginningDate = endingDate;
    }
    previousDate = [price[0], price[1]];
  }

  const timeFrame: { begin: Date, end: Date, days: number } = {
    begin: new Date(beginningDate[0]),
    end: new Date(endingDate[0]),
    days: Math.abs(endingDate[0] - beginningDate[0]) / 1000 / 60 / 60 / 24,
  };
  return timeFrame;
};

export default calculateDownwardTrend;
