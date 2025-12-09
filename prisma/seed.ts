import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hash = (value: string) => bcrypt.hash(value, 10);

async function main() {
  const [staffOnePassword, staffTwoPassword] = await Promise.all([hash('password123'), hash('password123')]);

  const staffOne = await prisma.user.upsert({
    where: { email: 'staff1@blueice.test' },
    update: {},
    create: {
      name: 'Delivery Staff One',
      email: 'staff1@blueice.test',
      password: staffOnePassword,
      role: 'DELIVERY_PERSON',
    },
  });

  const staffTwo = await prisma.user.upsert({
    where: { email: 'staff2@blueice.test' },
    update: {},
    create: {
      name: 'Delivery Staff Two',
      email: 'staff2@blueice.test',
      password: staffTwoPassword,
      role: 'DELIVERY_PERSON',
    },
  });

  const customerOne = await prisma.customer.upsert({
    where: { email: 'customer1@blueice.test' },
    update: {},
    create: {
      name: 'R442 Customer',
      address: 'Wednesday Bazar, Karachi',
      phoneNumber: '92342545399',
      email: 'customer1@blueice.test',
      pricingPlan: 'Standard',
      balance: 4000,
      deliverySchedule: 'Weekly',
      deliveryDay: 'tuesday',
      nextDeliveryDate: new Date('2025-11-25'),
      bottleBalance: 50,
      userId: staffOne.id,
    },
  });

  const customerTwo = await prisma.customer.upsert({
    where: { email: 'customer2@blueice.test' },
    update: {},
    create: {
      name: 'L1070 Customer',
      address: 'Sunday Market, Karachi',
      phoneNumber: '92382286580',
      email: 'customer2@blueice.test',
      pricingPlan: 'Standard',
      balance: 380,
      deliverySchedule: 'Weekly',
      deliveryDay: 'tuesday',
      nextDeliveryDate: new Date('2025-11-25'),
      bottleBalance: 50,
      userId: staffTwo.id,
    },
  });

  const existingProduct = await prisma.product.findFirst({
    where: { name: '19L Water Bottle' },
  });

  const product = existingProduct
    ? await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        price: 80,
        quantity: 500,
        description: existingProduct.description ?? 'Standard 19L bottle',
      },
    })
    : await prisma.product.create({
      data: {
        name: '19L Water Bottle',
        description: 'Standard 19L bottle',
        price: 80,
        quantity: 500,
      },
    });

  const deliveryOneExisting = await prisma.delivery.findFirst({
    where: { ticketNumber: '66706', code: 'R442' },
  });

  const deliveryOne = deliveryOneExisting
    ? await prisma.delivery.update({
      where: { id: deliveryOneExisting.id },
      data: {},
    })
    : await prisma.delivery.create({
      data: {
        date: new Date('2025-11-18'),
        scheduledDate: new Date('2025-11-18'),
        actualDate: new Date('2025-11-18'),
        status: 'DELIVERED',
        customerId: customerOne.id,
        deliveryPerson: staffOne.id,
        ticketNumber: '66706',
        code: 'R442',
        rate: 80,
        paymentType: 'cash',
        previousMonthAmount: 4000,
        currentMonthPaid: 12000,
        previousOutstanding: 0,
        currentOutstanding: 4000,
        previousBalance: 0,
        currentBalance: 4000,
        previousBottleBalance: 50,
        currentBottleBalance: 60,
        amountDue: 8000,
        amountReceived: 4000,
        entries: {
          create: [
            {
              entryDate: new Date('2025-11-02'),
              deliveredBottles: 60,
              dropBottle: 50,
              emptyBottle: 50,
              bottleBalance: 50,
              amountDue: 4000,
              amountReceived: 0,
              balanceAmount: 4000,
              avBottles: 50,
              vanAmount: 0,
            },
            {
              entryDate: new Date('2025-11-18'),
              deliveredBottles: 60,
              dropBottle: 50,
              emptyBottle: 50,
              bottleBalance: 50,
              amountDue: 4000,
              amountReceived: 4000,
              balanceAmount: 4000,
              avBottles: 50,
              vanAmount: 4000,
            },
          ],
        },
      },
    });

  const deliveryTwoExisting = await prisma.delivery.findFirst({
    where: { ticketNumber: '66705', code: 'L1070' },
  });

  const deliveryTwo = deliveryTwoExisting
    ? await prisma.delivery.update({
      where: { id: deliveryTwoExisting.id },
      data: {},
    })
    : await prisma.delivery.create({
      data: {
        date: new Date('2025-11-18'),
        scheduledDate: new Date('2025-11-18'),
        actualDate: new Date('2025-11-18'),
        status: 'DELIVERED',
        customerId: customerTwo.id,
        deliveryPerson: staffTwo.id,
        ticketNumber: '66705',
        code: 'L1070',
        rate: 80,
        paymentType: 'cash',
        previousMonthAmount: 4000,
        currentMonthPaid: 12000,
        previousOutstanding: 0,
        currentOutstanding: 380,
        previousBalance: 0,
        currentBalance: 380,
        previousBottleBalance: 50,
        currentBottleBalance: 68,
        amountDue: 8000,
        amountReceived: 380,
        entries: {
          create: [
            {
              entryDate: new Date('2025-11-08'),
              deliveredBottles: 50,
              dropBottle: 50,
              emptyBottle: 50,
              bottleBalance: 50,
              amountDue: 4000,
              amountReceived: 0,
              balanceAmount: 4000,
              avBottles: 50,
              vanAmount: 0,
            },
            {
              entryDate: new Date('2025-11-18'),
              deliveredBottles: 18,
              dropBottle: 18,
              emptyBottle: 18,
              bottleBalance: 18,
              amountDue: 4000,
              amountReceived: 380,
              balanceAmount: 380,
              avBottles: 18,
              vanAmount: 380,
            },
          ],
        },
      },
    });

  await prisma.deliveryProduct.createMany({
    data: [
      { deliveryId: deliveryOne.id, productId: product.id },
      { deliveryId: deliveryTwo.id, productId: product.id },
    ]
  });

  console.log('Seed data inserted.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
