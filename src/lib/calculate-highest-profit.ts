import { MarketChart } from '../types/coingecko.types';

const calculateHighestProfits = (marketChart: MarketChart) => {
  const { prices } = marketChart;

  // Filter data first so there's only one piece of data per day that is nearest the midnight
  const dailyPrices: number[][] = prices.filter((price) => price[0]
  % (86400 * 1000) < 3600 * 1000);
  const priceArr = dailyPrices.map((day) => day[1]);
  const dayArr = dailyPrices.map((day) => day[0]);
  console.log(priceArr);

  // Max difference script
  let minDate: number = dailyPrices[0][0];
  let maxDate: number = dailyPrices[0][0];
  let maxDiff = -1;
  let min = priceArr[0];

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

  let sellOrBuy: boolean = false;
  if (maxDiff > 0) sellOrBuy = true;

  // Create result object

  const result: { buyDate: Date, sellDate: Date, sellOrBuy: boolean } = {
    buyDate: new Date(minDate),
    sellDate: new Date(maxDate),
    sellOrBuy,
  };

  return result;
};

export default calculateHighestProfits;
