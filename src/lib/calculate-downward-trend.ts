import { log } from './logger';
import { MarketChart } from '../types/coingecko.types';

const calculateDownwardTrend = (marketChart: MarketChart) => {
  const { prices } = marketChart;
  let beginningDate: [number, number] = [0, 0];
  let endingDate: [number, number] = [0, 0];
  let longestTimeFrame: [number, number] = [0, 0];
  let previousDate: [number, number] = [0, 0];
  prices.forEach((price) => {
    if (price[1] > previousDate[1]) {
      endingDate = [previousDate[0], previousDate[1]];
      if (beginningDate[1] !== 0 && (endingDate[0] - beginningDate[0])
        > (longestTimeFrame[1] - longestTimeFrame[0])) {
        longestTimeFrame = [beginningDate[0], endingDate[0]];
      }
      beginningDate = endingDate;
    }
    previousDate = [price[0], price[1]];
  });

  const timeFrame: { beginDate: Date, endDate: Date, numberOfDays: number } = {
    beginDate: new Date(longestTimeFrame[0]),
    endDate: new Date(longestTimeFrame[1]),
    numberOfDays:
      Math.abs(longestTimeFrame[0] - longestTimeFrame[1]) / 1000 / 60 / 60 / 24,
  };
  return timeFrame;
};

export default calculateDownwardTrend;
