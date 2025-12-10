
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const db = new PrismaClient();

async function main() {
  console.log('--- Starting Delivery Completion & Invoice Scenarios ---');

  // 1. Setup
  const customer = await db.customer.create({
    data: {
      name: 'Test Invoice',
      address: 'Test Addr',
      phoneNumber: '999',
      email: `test-inv-${Date.now()}@example.com`,
      pricingPlan: 'Standard',
      deliverySchedule: 'Weekly',
      balance: 100, // Starts with 100 balance
      bottleBalance: 10,
    }
  });

  const delivery = await db.delivery.create({
    data: {
      date: new Date(),
      scheduledDate: new Date(),
      customerId: customer.id,
      status: 'SCHEDULED',
      rate: 10.0,
      entries: { create: [{ entryDate: new Date() }] }
    }
  });

  console.log(`Created delivery ${delivery.id} for customer ${customer.id}`);

  // 2. Logic to simulate PATCH /complete (Replicated from route.ts)
  async function completeDelivery(
      delId: string,
      payload: {
          delivered: number,
          empty: number,
          due: number,
          received: number
      }
    ) {
        // Fetch fresh
        const d = await db.delivery.findUnique({ where: { id: delId }, include: { customer: true } });
        if (!d) throw new Error('Delivery not found');
        const c = d.customer;

        const prevBottle = c.bottleBalance ?? 0;
        const prevBal = c.balance ?? 0;

        const newBottle = prevBottle + payload.delivered - payload.empty;
        const newBal = prevBal + payload.due - payload.received;

        // Update Delivery
        const updated = await db.delivery.update({
            where: { id: delId },
            data: {
                status: 'DELIVERED',
                previousBalance: prevBal,
                currentBalance: newBal,
                previousBottleBalance: prevBottle,
                currentBottleBalance: newBottle,
                amountDue: payload.due,
                amountReceived: payload.received,
                entries: {
                    deleteMany: {},
                    create: [{
                        entryDate: new Date(),
                        deliveredBottles: payload.delivered,
                        emptyBottle: payload.empty,
                        bottleBalance: newBottle,
                        amountDue: payload.due,
                        amountReceived: payload.received,
                        balanceAmount: newBal,
                    }]
                }
            }
        });

        // Update Customer
        await db.customer.update({
            where: { id: c.id },
            data: {
                balance: newBal,
                bottleBalance: newBottle,
            }
        });

        // Create Invoice
        const inv = await db.invoice.create({
            data: {
                amount: payload.due,
                status: newBal <= 0 ? 'PAID' : 'UNPAID', // Logic check
                customerId: c.id,
                deliveryId: delId,
            }
        });

        return { delivery: updated, invoice: inv, customer: await db.customer.findUnique({ where: { id: c.id } }) };
  }

  // Scenario A: Partial Payment
  // Delivered 5, Rate 10 => Due 50. Received 20.
  // Start Balance 100. New Balance should be 100 + 50 - 20 = 130.
  // Invoice status should be UNPAID (since 130 > 0).
  const resA = await completeDelivery(delivery.id, {
      delivered: 5,
      empty: 0,
      due: 50,
      received: 20
  });

  console.log('Scenario A (Partial Payment):');
  console.log(`- New Balance: ${resA.customer?.balance} (Expected 130)`);
  console.log(`- Invoice Status: ${resA.invoice.status} (Expected UNPAID)`);
  console.log(`- Invoice Amount: ${resA.invoice.amount} (Expected 50)`);

  if (resA.customer?.balance === 130 && resA.invoice.status === 'UNPAID' && resA.invoice.amount === 50) {
      console.log('PASS: Scenario A');
  } else {
      console.log('FAIL: Scenario A');
  }

  // Cleanup
  await db.invoice.deleteMany({ where: { customerId: customer.id } });
  await db.deliveryEntry.deleteMany({ where: { deliveryId: delivery.id } });
  await db.delivery.deleteMany({ where: { id: delivery.id } });
  await db.customer.delete({ where: { id: customer.id } });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
