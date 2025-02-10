export interface InstrumentResponse {
    data: Instrument[];
    paging: any;
}
export interface Instrument {
    id: string,
    symbol: string,
    kind: string,
    description: string,
    tickSize: number,
    currency: string,
    baseCurrency: string,
    mappings: any,
    profile: any,
}

export interface ChartItem {
  timestamp: string|Date|any,
  price: number,
  volume: number
}
