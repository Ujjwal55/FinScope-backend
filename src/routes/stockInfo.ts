import { Router } from 'express';
import axios from 'axios';
import { log } from '../config/logger.js';
import { yahooSymbol } from '../utils/utils.js';

const router = Router();


const sectorMap: Record<string, string> = {
  'Financial Services': 'Financials',
  'Technology': 'Technology',
  'Consumer Cyclical': 'Consumer Goods',
  'Healthcare': 'Pharmaceuticals',
  'Energy': 'Energy',
  'Industrials': 'Industrials',
  'Basic Materials': 'Metals',
  'Consumer Defensive': 'Consumer Goods',
  'Communication Services': 'Technology',
  'Utilities': 'Utilities',
  'Real Estate': 'Real Estate'
};

router.get('/', async (req, res) => {
  const symbol = String(req.query.symbol || '');
  const exchange = String(req.query.exchange || '');

  if (!symbol || !exchange) {
    return res.status(400).json({ error: 'symbol and exchange required' });
  }

  try {
    const ySym = yahooSymbol(symbol, exchange);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySym)}`;

    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    // console.log("responseeeee", response)

    const result = response.data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const name = meta.longName || meta.shortName || symbol;
    const rawSector = meta.sector || 'Other';
    const sector = sectorMap[rawSector] || rawSector || 'Other';

    log.info(`Fetched stock info for ${ySym}: ${name}`);

    res.json({
      symbol,
      exchange,
      name,
      sector
    });
  } catch (error: any) {
    log.error(`Failed to fetch stock info for ${symbol}:${exchange} - ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch stock info' });
  }
});

export default router;
