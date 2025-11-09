# FinScope Backend

TypeScript Express API with MongoDB (repository pattern) and market data service.

## Features
- Holdings repository (Mongo via Mongoose, swappable via interface)
- Market data from Yahoo (CMP) and Google (P/E, Latest Earnings)
- Caching and rate limiting to reduce scraping pressure

## Environment
Copy `.env.example` to `.env` and adjust as needed.

## Commands
- `npm install`
- `npm run dev` (local dev)
- `npm run build && npm start` (production)

## Docker
- `docker compose up --build`

## API
- `GET /api/health`
- `GET /api/holdings`
- `POST /api/holdings`
- `GET /api/market-data?symbol=TICKER&exchange=NSE|BSE|...`
- `GET /api/market-data/batch?symbols=SBIN:NSE,INFY:NSE`

Notes: Yahoo/Google do not provide official public APIs. Scraping may break when sites change.
