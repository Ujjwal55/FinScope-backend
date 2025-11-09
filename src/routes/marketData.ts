import { Router } from 'express';
import { MarketDataService } from '../services/MarketDataService.js';

const router = Router();
const svc = new MarketDataService();

router.get('/', async (req, res) => {
  const symbol = String(req.query.symbol || '');
  const exchange = String(req.query.exchange || '');
  if (!symbol || !exchange) return res.status(400).json({ error: 'symbol and exchange required' });
  const data = await svc.get(symbol, exchange);
  res.json(data);
});

router.get('/batch', async (req, res) => {
  const list = String(req.query.symbols || '');
  if (!list) return res.status(400).json({ error: 'symbols required' });
  const pairs = list
    .split(',')
    .map(s => {
      const [symbol, exchange] = s.split(':');
      return { symbol: symbol?.trim() || '', exchange: exchange?.trim() || '' };
    })
    .filter(p => p.symbol && p.exchange);
  const data = await svc.getBatch(pairs);
  res.json(data);
});

export default router;
