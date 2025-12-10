
import { PrismaClient } from '@prisma/client';
import { addDays, startOfDay } from 'date-fns';

const db = new PrismaClient();

async function main() {
  const targetDate = startOfDay(addDays(new Date(), 1)); // Tomorrow
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  console.log(`Target Date: ${targetDate.toISOString()}`);
  console.log(`Day Name: ${dayName}`);

  // Create a test customer
  const customer = await db.customer.create({
    data: {
      name: 'Test Scheduler',
      address: '123 Test St',
      phoneNumber: '1234567890',
      email: `test-${Date.now()}@example.com`,
      pricingPlan: 'Standard',
      deliverySchedule: 'Bi-weekly',
      deliveryDay: dayName,
      nextDeliveryDate: targetDate,
    }
  });
  console.log(`Created customer: ${customer.id} with schedule: ${customer.deliverySchedule}`);

  // Run Query Logic (Copied from route)
  const customers = await db.customer.findMany({
    where: {
      OR: [
        {
          nextDeliveryDate: {
            gte: targetDate,
            lt: addDays(targetDate, 1),
          },
        },
        {
          nextDeliveryDate: null,
          deliveryDay: dayName,
          deliverySchedule: 'Weekly',
        },
      ],
    },
  });

  console.log(`Found ${customers.length} customers to schedule`);
  const found = customers.find(c => c.id === customer.id);

  if (found) {
    console.log('SUCCESS: Found our test customer');
  } else {
    console.log('FAILURE: Did not find test customer');
  }

  // Simulate Schedule Update
  if (found) {
      let nextDate = found.nextDeliveryDate ? new Date(found.nextDeliveryDate) : targetDate;
      const schedule = found.deliverySchedule.toLowerCase();

      if (schedule.includes('bi-weekly') || schedule.includes('biweekly')) {
        nextDate = addDays(nextDate, 14);
      } else if (schedule.includes('monthly')) {
        nextDate = addDays(nextDate, 30);
      } else {
        nextDate = addDays(nextDate, 7);
      }

      console.log(`Next delivery date calculated as: ${nextDate.toISOString()}`);

      if (nextDate.getTime() > targetDate.getTime()) {
           console.log('SUCCESS: Next date is in the future');
      } else {
           console.log('FAILURE: Next date was not advanced');
      }
  }

   // Cleanup
  await db.customer.delete({ where: { id: customer.id } });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
