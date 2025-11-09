export type ExchangeCode = 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ' | 'OTHER';

export interface Holding {
  id?: string;
  userId: string;
  symbol: string;
  name: string;
  exchange: ExchangeCode;
  sector: string;
  purchasePrice: number;
  quantity: number;
}
