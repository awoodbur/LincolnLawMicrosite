import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test lead
  const testLead = await prisma.lead.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      state: 'Utah',
      county: 'Salt Lake',
      householdSize: 3,
      maritalStatus: 'Married',
      monthlyIncomeRange: '$3–5k',
      unsecuredDebtRange: '$25–50k',
      employmentStatus: 'Employed',
      missedPayments: true,
      wageGarnishment: false,
      propertyConcerns: true,
      notes: 'Testing seed data',
      email: 'test@example.com',
      consentPrivacy: true,
      consentTerms: true,
      consentData: true,
      source: 'lincolnlaw-utah-intake',
    },
  });

  console.log('✅ Created test lead:', testLead.email);

  // Create consent log
  await prisma.consentLog.create({
    data: {
      leadId: testLead.id,
      version: 'v1.0',
      ip: '127.0.0.1',
      userAgent: 'Test/1.0',
    },
  });

  console.log('✅ Created consent log');

  // Create audit log
  await prisma.auditLog.create({
    data: {
      leadId: testLead.id,
      actor: 'system',
      event: 'lead_created',
      payloadJson: JSON.stringify({ state: 'Utah', householdSize: 3 }),
    },
  });

  console.log('✅ Created audit log');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
