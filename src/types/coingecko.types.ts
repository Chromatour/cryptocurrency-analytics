export interface MarketChart {
  prices: number[][],
  marketCap: number[][],
  tradingVolumes: number[][]
}

export interface DateBody {
  fromDate: string,
  toDate: string
}
