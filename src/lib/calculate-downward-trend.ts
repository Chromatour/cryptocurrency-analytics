import { MarketChart } from '../types/coingecko.types';

const calculateDownwardTrend = (marketChart: MarketChart) => {
  const { prices } = marketChart;

  // Filter data first so there's only one piece of data per day
  const hourlyPrices = prices.filter((price) => price[0]
  % (86400 * 1000) < 3600 * 1000);

  // Data structure: [number(unix timestamp), number(btc price)]
  let longestTimeFrame: [number, number] = [0, 0];
  let begDate: number = 0;
  let endDate: number = 0;
  let prevDate: number = 0;
  let prevPrice: number = 0;
  let flag: boolean = false;

  hourlyPrices.forEach((datePrice, idx, arr) => {
    const date = datePrice[0];
    const price = datePrice[1];

    if (idx === 0) {
      begDate = date;
      endDate = date;
    } else if (price > prevPrice) {
      endDate = prevDate;
      flag = true;
    } else if (idx === arr.length - 1) { // last iteration if downward trend
      endDate = date;
      flag = true;
    }

    if (flag && idx !== 0) {
      if ((endDate - begDate)
      > (longestTimeFrame[1] - longestTimeFrame[0])) {
        longestTimeFrame = [begDate, endDate];
      }
      begDate = date;
    }
    flag = false;
    prevDate = date;
    prevPrice = price;
  });

  // Create object for results
  const result: { beginDate: Date, endDate: Date, numberOfDays: number } = {
    beginDate: new Date(longestTimeFrame[0]),
    endDate: new Date(longestTimeFrame[1]),
    numberOfDays:
      Math.round(Math.abs(longestTimeFrame[0]
        - longestTimeFrame[1]) / 1000 / 60 / 60 / 24),
  };
  return result;
};

export default calculateDownwardTrend;
