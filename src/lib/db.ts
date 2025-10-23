import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Get DATABASE_URL - in Amplify serverless, it might come from different sources
function getDatabaseUrl(): string | undefined {
  // Try various sources in order of preference
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) return dbUrl;

  // @ts-ignore - Next.js env config
  if (typeof window === 'undefined' && global.process?.env?.DATABASE_URL) {
    return global.process.env.DATABASE_URL;
  }

  return undefined;
}

// Log database configuration for debugging
if (process.env.NODE_ENV === 'production') {
  const dbUrl = getDatabaseUrl();
  console.log('[DB] Checking DATABASE_URL availability...');
  console.log('[DB] DATABASE_URL present:', !!dbUrl);
  console.log('[DB] All env vars:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')).join(', '));

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

// Create Prisma Client with explicit datasource override for Amplify serverless
const dbUrl = getDatabaseUrl();
const prismaOptions: any = {
  log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
};

// In production, explicitly set the datasource URL if available
if (process.env.NODE_ENV === 'production' && dbUrl) {
  prismaOptions.datasources = {
    db: {
      url: dbUrl
    }
  };
  console.log('[DB] Using explicit datasource URL for Prisma');
}

export const db = global.prisma || new PrismaClient(prismaOptions);

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
