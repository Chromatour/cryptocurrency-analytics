import { MarketChart } from '../types/coingecko.types';

/**
 * Calculate days to buy and sell to get highest profit in given range
 * @param marketChart data to be analysed
 * @returns object that includes buying date,
 * selling date and if on should act (if there was any profit to get)
 */
const calculateHighestProfits = (marketChart: MarketChart) => {
  const { prices } = marketChart;

  // Filter data first so there's only one piece of data per day that is nearest the midnight
  const dailyPrices: number[][] = prices.filter((price) => price[0]
  % (86400 * 1000) < 3600 * 1000);

  // Separate price and day for readability
  const priceArr = dailyPrices.map((day) => day[1]);
  const dayArr = dailyPrices.map((day) => day[0]);

  // Init variables for max difference
  let minDate: number = dailyPrices[0][0];
  let maxDate: number = dailyPrices[0][0];
  let maxDiff = -1;
  let min = priceArr[0];

  // Calculate max difference
  for (let idx = 0; idx < priceArr.length; idx++) {
    // If difference increases, update the dates
    if (priceArr[idx] > min && maxDiff < priceArr[idx] - min) {
      maxDiff = priceArr[idx] - min;
      minDate = dayArr[priceArr.indexOf(min)];
      maxDate = dayArr[idx];
    }

    if (priceArr[idx] < min) {
      min = priceArr[idx];
    }
  }

  let profit: boolean = false;
  if (maxDiff > 0) profit = true;

  // Create result object
  const result: { buyDate: Date, sellDate: Date, profit: boolean } = {
    buyDate: new Date(minDate),
    sellDate: new Date(maxDate),
    profit,
  };

  return result;
};

export default calculateHighestProfits;
