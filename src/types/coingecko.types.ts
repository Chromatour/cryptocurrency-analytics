export interface MarketChart {
  prices: number[][],
  marketCap: number[][],
  total_volumes: number[][]
}

export interface DateBody {
  fromDate: string,
  toDate: string
}
