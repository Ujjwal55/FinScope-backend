import axios from 'axios';
import * as cheerio from 'cheerio';
import { TTLCache } from './Cache.js';
import { env } from '../config/env.js';
import { log } from '../config/logger.js';
import { yahooSymbol } from '../utils/utils.js';

export type MarketData = {
  symbol: string;
  exchange: string;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
};


async function fetchYahooCMP(symbol: string, exchange: string): Promise<number | null> {
  try {
    const ySym = yahooSymbol(symbol, exchange);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySym)}`;
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com/'
      }
    });

    // console.log("responseee from the yahoo api", response)

    const price = response.data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (typeof price === 'number') {
      log.info(`Fetched CMP for ${ySym}: ${price}`);
      return price;
    }

    log.warn(`No price found for ${ySym}`);
    return null;
  } catch (error: any) {
    log.error(`Yahoo Finance error for ${symbol}:${exchange} - ${error.message}`);
    return null;
  }
}


export class MarketDataService {
  private cache = new TTLCache<MarketData>(env.marketCacheTtlSec * 1000);

  async get(symbol: string, exchange: string): Promise<MarketData> {
    const key = `${symbol}:${exchange}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const cmp = await fetchYahooCMP(symbol, exchange);
    const result: MarketData = { symbol, exchange, cmp, peRatio: null, latestEarnings: null };
    this.cache.set(key, result);
    return result;
  }

  async getBatch(pairs: Array<{ symbol: string; exchange: string }>): Promise<MarketData[]> {
    return Promise.all(pairs.map(p => this.get(p.symbol, p.exchange)));
  }
}
