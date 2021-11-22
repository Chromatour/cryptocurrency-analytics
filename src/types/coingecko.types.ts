// Different data interfaces for response and usage to unify casing style in code

export interface MarketChartResponse {
  prices: number[][],
  marketCap: number[][],
  total_volumes: number[][]
}

export interface MarketChart {
  prices: number[][],
  marketCap: number[][],
  tradingVolumes: number[][]
}

export interface DateBody {
  fromDate: string,
  toDate: string
}
