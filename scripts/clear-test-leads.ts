import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearTestLeads() {
  try {
    // Delete all leads with test email
    const result = await prisma.lead.deleteMany({
      where: {
        email: {
          contains: 'test',
        },
      },
    });

    console.log(`Deleted ${result.count} test leads`);

    // Or delete all leads (uncomment if needed)
    // const allResult = await prisma.lead.deleteMany({});
    // console.log(`Deleted ${allResult.count} leads`);

  } catch (error) {
    console.error('Error clearing test leads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearTestLeads();
