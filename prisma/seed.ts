import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Delete existing test lead if it exists
  await prisma.lead.deleteMany({
    where: { email: 'test@example.com' },
  });

  // Create a test lead with updated schema
  const testLead = await prisma.lead.create({
    data: {
      // Contact
      email: 'test@example.com',
      phone: '(555) 123-4567',

      // Location
      state: 'Utah',
      county: 'Salt Lake County',

      // Household
      householdSize: 3,
      maritalStatus: 'Married',

      // Employment & History
      employmentStatus: 'Employed',
      priorBankruptcy: false,

      // Financial Details
      isAboveMedian: false,
      monthlyExpenses: 3500.00,
      totalDebt: '$25-50k',

      // Assets
      homeEquity: 25000.00,
      vehicleEquity: 5000.00,
      hasValuableItems: false,

      // Urgency Flags
      missedPayments: true,
      wageGarnishment: false,
      propertyConcerns: true,

      // Additional
      notes: 'Test lead for development',
    },
  });

  console.log('✅ Created test lead:', testLead.email);

  // Create consent log
  await prisma.consentLog.create({
    data: {
      leadId: testLead.id,
      consentType: 'all',
      consentVersion: 'v1.0',
      ipAddress: '127.0.0.1',
      userAgent: 'Test/1.0',
    },
  });

  console.log('✅ Created consent log');

  // Create audit log
  await prisma.auditLog.create({
    data: {
      leadId: testLead.id,
      event: 'lead_created',
      details: { state: 'Utah', householdSize: 3 },
      ipAddress: '127.0.0.1',
      userAgent: 'Test/1.0',
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
