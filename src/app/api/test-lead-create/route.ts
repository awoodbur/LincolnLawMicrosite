import { NextRequest, NextResponse } from 'next/server';

// Minimal version of leads/create to test what's failing
export async function POST(req: NextRequest) {
  console.log('[TEST-LEAD-CREATE] Request received');

  try {
    // Step 1: Parse body
    console.log('[TEST-LEAD-CREATE] Parsing body...');
    const body = await req.json();
    console.log('[TEST-LEAD-CREATE] Body parsed. Keys:', Object.keys(body));

    // Step 2: Try importing env
    console.log('[TEST-LEAD-CREATE] Importing env...');
    const { env } = await import('@/lib/env');
    console.log('[TEST-LEAD-CREATE] env imported successfully');

    // Step 3: Try importing db
    console.log('[TEST-LEAD-CREATE] Importing db...');
    const { db } = await import('@/lib/db');
    console.log('[TEST-LEAD-CREATE] db imported successfully');

    // Step 4: Try importing validation
    console.log('[TEST-LEAD-CREATE] Importing leadSchema...');
    const { leadSchema } = await import('@/lib/validation/intake');
    console.log('[TEST-LEAD-CREATE] leadSchema imported successfully');

    // Step 5: Try validation
    console.log('[TEST-LEAD-CREATE] Validating data...');
    const validatedData = leadSchema.parse(body);
    console.log('[TEST-LEAD-CREATE] Data validated successfully');

    // Step 6: Try database write
    console.log('[TEST-LEAD-CREATE] Creating lead in database...');
    const lead = await db.lead.create({
      data: {
        state: validatedData.state,
        county: validatedData.county,
        householdSize: validatedData.householdSize,
        maritalStatus: validatedData.maritalStatus,
        monthlyIncomeRange: validatedData.monthlyIncomeRange,
        unsecuredDebtRange: validatedData.unsecuredDebtRange,
        employmentStatus: validatedData.employmentStatus,
        missedPayments: validatedData.missedPayments,
        wageGarnishment: validatedData.wageGarnishment,
        propertyConcerns: validatedData.propertyConcerns,
        notes: validatedData.notes,
        email: validatedData.email,
        consentPrivacy: validatedData.consentPrivacy,
        consentTerms: validatedData.consentTerms,
        consentData: validatedData.consentData,
        source: validatedData.source || 'lincolnlaw-utah-intake',
      },
    });
    console.log('[TEST-LEAD-CREATE] Lead created:', lead.id);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Test endpoint - all steps completed'
    });

  } catch (error) {
    console.error('[TEST-LEAD-CREATE] Error at some step:', error);
    return NextResponse.json(
      {
        error: 'Test endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
