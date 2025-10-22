import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Log database configuration for debugging
if (process.env.NODE_ENV === 'production') {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('[DB] ERROR: DATABASE_URL is not set in production');
  } else if (!dbUrl.startsWith('postgresql://')) {
    console.error('[DB] ERROR: DATABASE_URL does not appear to be a PostgreSQL URL');
  } else {
    // Log without exposing credentials
    const urlParts = dbUrl.match(/^postgresql:\/\/[^@]+@([^/]+)\/(.+)$/);
    if (urlParts) {
      console.log(`[DB] Connected to PostgreSQL at ${urlParts[1]}, database: ${urlParts[2].split('?')[0]}`);
    }
  }
}

export const db = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
}

// Test connection on initialization
db.$connect()
  .then(() => {
    console.log('[DB] Prisma Client connected successfully');
  })
  .catch((error) => {
    console.error('[DB] Failed to connect to database:', error.message);
  });
