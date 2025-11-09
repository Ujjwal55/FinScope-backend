import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongooseUserRepository } from '../repositories/MongooseUserRepository.js';
import { env } from '../config/env.js';
import { log } from '../config/logger.js';

const router = Router();
const userRepo = new MongooseUserRepository();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepo.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim()
    });

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' });

    log.info(`User registered: ${email}`);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    log.error(`Registration error: ${error.message}`);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' });

    log.info(`User logged in: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    log.error(`Login error: ${error.message}`);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
