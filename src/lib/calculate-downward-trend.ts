import { MarketChart } from '../types/coingecko.types';

/**
 * Calculate longest downward trend in given range
 * @param marketChart data to be analysed
 * @returns object that includes start date,
 * end date and number of days for longest downward trend
 */
const calculateDownwardTrend = (marketChart: MarketChart) => {
  const { prices } = marketChart;

  // Filter data first so there's only one piece of data per day that is nearest the midnight
  const dailyPrices: number[][] = prices.filter((price) => price[0]
  % (86400 * 1000) < 3600 * 1000);

  // Data structure: [number(unix timestamp), number(btc price)]
  let longestTimeFrame: [number, number] = [0, 0];
  let begDate: number = 0;
  let endDate: number = 0;
  let prevDate: number = 0;
  let prevPrice: number = 0;
  let trendEnded: boolean = false;

  dailyPrices.forEach((datePrice, idx, arr) => {
    const date = datePrice[0];
    const price = datePrice[1];

    // Assign current values if first iteration, otherwise check if trend ended or final iteration
    if (idx === 0) {
      begDate = date;
      endDate = date;
    } else if (price > prevPrice) {
      endDate = prevDate;
      trendEnded = true;
    } else if (idx === arr.length - 1) {
      endDate = date;
      trendEnded = true;
    }

    if (trendEnded) {
      // Assign values if current trend is longer than previous one
      if ((endDate - begDate)
      > (longestTimeFrame[1] - longestTimeFrame[0])) {
        longestTimeFrame = [begDate, endDate];
      }
      begDate = date;
    }
    trendEnded = false;
    prevDate = date;
    prevPrice = price;
  });

  // Create object for results. Round to closest because using near to midnight times
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
