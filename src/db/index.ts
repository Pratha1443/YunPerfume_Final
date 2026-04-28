import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(d1: D1Database) {
  return drizzle(d1, { schema, logger: process.env.NODE_ENV === 'development' });
}

export type Database = ReturnType<typeof getDb>;

// Re-export everything from schema for convenient imports:
// import { getDb, products, orders } from '@/db'
export * from './schema';
