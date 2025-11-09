export const VALID_EXCHANGES = ['NSE', 'BSE', 'NYSE', 'NASDAQ', 'OTHER'];

export function validateHolding(data: any, partial = false): { valid: boolean; error?: string } {
  if (!partial) {
    if (!data.symbol || typeof data.symbol !== 'string' || data.symbol.trim().length === 0) {
      return { valid: false, error: 'Symbol is required' };
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return { valid: false, error: 'Name is required' };
    }

    if (!data.exchange || !VALID_EXCHANGES.includes(data.exchange)) {
      return { valid: false, error: 'Valid exchange is required (NSE, BSE, NYSE, NASDAQ, OTHER)' };
    }

    if (!data.sector || typeof data.sector !== 'string' || data.sector.trim().length === 0) {
      return { valid: false, error: 'Sector is required' };
    }

    if (typeof data.purchasePrice !== 'number' || data.purchasePrice <= 0) {
      return { valid: false, error: 'Purchase price must be a positive number' };
    }

    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
      return { valid: false, error: 'Quantity must be a positive number' };
    }
  } else {
    if (data.symbol !== undefined && (typeof data.symbol !== 'string' || data.symbol.trim().length === 0)) {
      return { valid: false, error: 'Symbol must be a non-empty string' };
    }

    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
      return { valid: false, error: 'Name must be a non-empty string' };
    }

    if (data.exchange !== undefined && !VALID_EXCHANGES.includes(data.exchange)) {
      return { valid: false, error: 'Valid exchange is required (NSE, BSE, NYSE, NASDAQ, OTHER)' };
    }

    if (data.sector !== undefined && (typeof data.sector !== 'string' || data.sector.trim().length === 0)) {
      return { valid: false, error: 'Sector must be a non-empty string' };
    }

    if (data.purchasePrice !== undefined && (typeof data.purchasePrice !== 'number' || data.purchasePrice <= 0)) {
      return { valid: false, error: 'Purchase price must be a positive number' };
    }

    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || data.quantity <= 0)) {
      return { valid: false, error: 'Quantity must be a positive number' };
    }
  }

  return { valid: true };
}

export function yahooSymbol(symbol: string, exchange: string): string {
  const map: Record<string, string> = { NSE: 'NS', BSE: 'BO' };
  const suffix = map[exchange] || '';
  return suffix ? `${symbol}.${suffix}` : symbol;
}