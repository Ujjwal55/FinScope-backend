import { Router } from 'express';
import { MongooseHoldingRepository } from '../repositories/MongooseHoldingRepository.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validateHolding } from '../utils/utils.js';

const router = Router();
const repo = new MongooseHoldingRepository();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  const list = await repo.list(req.userId!);
  // console.log("listttttt", list)
  res.json(list);
});

router.post('/', async (req: AuthRequest, res) => {
  const validation = validateHolding(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const existing = await repo.list(req.userId!);
  const duplicate = existing.find(
    holding => holding.symbol === req.body.symbol && holding.exchange === req.body.exchange
  );
  if (duplicate) {
    return res.status(409).json({
      error: `Stock ${req.body.symbol} (${req.body.exchange}) already exists in your portfolio`
    });
  }

  const created = await repo.create({ ...req.body, userId: req.userId! });
  res.status(201).json(created);
});

router.put('/:id', async (req: AuthRequest, res) => {
  const id = req.params.id;
  const validation = validateHolding(req.body, true);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const updated = await repo.update(id, req.userId!, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(updated);
});

router.delete('/:id', async (req: AuthRequest, res) => {
  const id = req.params.id;
  const ok = await repo.delete(id, req.userId!);
  res.json({ ok });
});

export default router;
