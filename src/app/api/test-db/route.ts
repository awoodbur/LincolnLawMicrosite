import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('[TEST-DB] Testing database connection...');

    // Try to query the database
    const count = await db.lead.count();

    console.log('[TEST-DB] Database connection successful. Lead count:', count);

    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      leadCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[TEST-DB] Database connection failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
