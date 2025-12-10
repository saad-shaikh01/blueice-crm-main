
import { PrismaClient } from '@prisma/client';
import { addDays, startOfDay, subDays } from 'date-fns';

const db = new PrismaClient();

async function main() {
  console.log('--- Starting Scheduler Scenarios ---');

  // 1. Setup Test Customers
  const today = startOfDay(new Date());

  // Weekly customer due today
  const weeklyCustomer = await db.customer.create({
    data: {
      name: 'Test Weekly',
      address: 'Test Addr',
      phoneNumber: '000',
      email: `test-weekly-${Date.now()}@example.com`,
      pricingPlan: 'Standard',
      deliverySchedule: 'Weekly',
      deliveryDay: today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
      nextDeliveryDate: today,
    }
  });

  // Bi-weekly customer due today
  const biWeeklyCustomer = await db.customer.create({
    data: {
      name: 'Test BiWeekly',
      address: 'Test Addr',
      phoneNumber: '001',
      email: `test-biweekly-${Date.now()}@example.com`,
      pricingPlan: 'Standard',
      deliverySchedule: 'Bi-weekly',
      deliveryDay: today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
      nextDeliveryDate: today,
    }
  });

   // Missed customer (due yesterday)
   const missedCustomer = await db.customer.create({
    data: {
      name: 'Test Missed',
      address: 'Test Addr',
      phoneNumber: '002',
      email: `test-missed-${Date.now()}@example.com`,
      pricingPlan: 'Standard',
      deliverySchedule: 'Weekly',
      deliveryDay: today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
      nextDeliveryDate: subDays(today, 1), // Yesterday
    }
  });

  console.log('Created test customers.');

  // 2. Mock Logic of Scheduler (Copy-Paste Logic for testing)
  // We will call the actual route logic here essentially, but since we can't easily invoke Hono route, we replicate the critical logic or use a helper if extracted.
  // Since logic is inside route.ts, I will replicate it here to verify the ALGORITHM.

  async function runScheduler(targetDate: Date) {
      const normalizedTargetDate = startOfDay(targetDate);
      const dayName = normalizedTargetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      const customers = await db.customer.findMany({
        where: {
            OR: [
            {
                nextDeliveryDate: {
                lte: normalizedTargetDate,
                },
            },
            {
                nextDeliveryDate: null,
                deliveryDay: dayName,
                deliverySchedule: 'Weekly',
            },
            ],
            // Only fetch OUR test customers to avoid noise
            email: { in: [weeklyCustomer.email, biWeeklyCustomer.email, missedCustomer.email] }
        },
    });

    console.log(`Scheduler found ${customers.length} customers for date ${normalizedTargetDate.toISOString()}`);

    for (const customer of customers) {
         let nextDate = customer.nextDeliveryDate ? new Date(customer.nextDeliveryDate) : normalizedTargetDate;
         const schedule = customer.deliverySchedule.toLowerCase();

        // Check exists
        const existing = await db.delivery.findFirst({
             where: {
                customerId: customer.id,
                scheduledDate: {
                    gte: normalizedTargetDate,
                    lt: addDays(normalizedTargetDate, 1),
                },
                status: { not: 'CANCELLED' }
             }
        });

        if (existing) {
             console.log(`Delivery already exists for ${customer.name}`);
             if (nextDate <= normalizedTargetDate) {
                 // Advance logic
                 if (schedule.includes('bi-weekly') || schedule.includes('biweekly')) {
                    nextDate = addDays(nextDate, 14);
                  } else {
                    nextDate = addDays(nextDate, 7);
                  }
                  await db.customer.update({ where: { id: customer.id }, data: { nextDeliveryDate: nextDate }});
                  console.log(`Advanced date for existing delivery customer ${customer.name} to ${nextDate.toISOString()}`);
             }
             continue;
        }

        // Create
        await db.delivery.create({
            data: {
                date: normalizedTargetDate,
                scheduledDate: normalizedTargetDate,
                customerId: customer.id,
                entries: { create: [{ entryDate: normalizedTargetDate }] }
            }
        });
        console.log(`Created delivery for ${customer.name}`);

        // Advance
        let baseline = customer.nextDeliveryDate ? new Date(customer.nextDeliveryDate) : normalizedTargetDate;
         if (schedule.includes('bi-weekly') || schedule.includes('biweekly')) {
            nextDate = addDays(baseline, 14);
          } else {
            nextDate = addDays(baseline, 7);
          }

        await db.customer.update({ where: { id: customer.id }, data: { nextDeliveryDate: nextDate }});
        console.log(`Advanced date for ${customer.name} to ${nextDate.toISOString()}`);
    }
  }

  // Run 1: Today
  await runScheduler(today);

  // Verify
  const c1 = await db.customer.findUnique({ where: { id: weeklyCustomer.id } });
  const c2 = await db.customer.findUnique({ where: { id: biWeeklyCustomer.id } });
  const c3 = await db.customer.findUnique({ where: { id: missedCustomer.id } });

  // Weekly should be today + 7
  if (c1?.nextDeliveryDate?.getTime() === addDays(today, 7).getTime()) console.log('PASS: Weekly advanced 7 days');
  else console.log('FAIL: Weekly date incorrect', c1?.nextDeliveryDate);

  // BiWeekly should be today + 14
  if (c2?.nextDeliveryDate?.getTime() === addDays(today, 14).getTime()) console.log('PASS: BiWeekly advanced 14 days');
  else console.log('FAIL: BiWeekly date incorrect', c2?.nextDeliveryDate);

  // Missed (yesterday) should be yesterday + 7 = today + 6
  // Wait, if it was missed yesterday, we scheduled it TODAY (catch up).
  // The baseline was "yesterday". So next date should be yesterday + 7.
  const yesterday = subDays(today, 1);
  if (c3?.nextDeliveryDate?.getTime() === addDays(yesterday, 7).getTime()) console.log('PASS: Missed advanced 7 days from due date');
  else console.log('FAIL: Missed date incorrect', c3?.nextDeliveryDate);


  // Run 2: Run again TODAY (Duplicate Check)
  console.log('--- Running Duplicate Check ---');
  await runScheduler(today);
  // Should verify that dates did NOT advance further because nextDeliveryDate is now in future
  const c1_again = await db.customer.findUnique({ where: { id: weeklyCustomer.id } });
  if (c1_again?.nextDeliveryDate?.getTime() === c1?.nextDeliveryDate?.getTime()) console.log('PASS: Date did not double advance');
  else console.log('FAIL: Date advanced incorrectly on duplicate run');

  // Cleanup
  await db.delivery.deleteMany({ where: { customerId: { in: [weeklyCustomer.id, biWeeklyCustomer.id, missedCustomer.id] } } });
  await db.customer.deleteMany({ where: { id: { in: [weeklyCustomer.id, biWeeklyCustomer.id, missedCustomer.id] } } });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
