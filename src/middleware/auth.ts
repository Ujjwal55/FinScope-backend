import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.slice(7);
    // console.log("tokennnnn", token);

    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    // console.log("userIdddddd", decoded.userId);

    req.userId = decoded.userId;

    next();
  } catch (error: any) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

