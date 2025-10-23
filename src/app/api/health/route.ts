import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[HEALTH] Health check endpoint called');

    // Test basic environment
    const hasDatabase = !!process.env.DATABASE_URL;
    const hasMailgun = !!process.env.MAILGUN_API_KEY;
    const hasPlaid = !!process.env.PLAID_CLIENT_ID;

    console.log('[HEALTH] Environment check:', {
      hasDatabase,
      hasMailgun,
      hasPlaid,
      nodeEnv: process.env.NODE_ENV
    });

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabase,
        hasMailgun,
        hasPlaid,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('[HEALTH] Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
