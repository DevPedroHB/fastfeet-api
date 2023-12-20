import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateOrder {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateOrder({
  client,
  faker,
  factory,
}: IFabricateOrder) {
  const l = factory.recipients.length;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const postedAt = faker.datatype.boolean()
      ? faker.date.recent({ days: 7 })
      : null;
    const withdrawnAt =
      faker.datatype.boolean() && postedAt
        ? faker.date.recent({ refDate: postedAt })
        : null;
    const deliveredAt =
      faker.datatype.boolean() && withdrawnAt
        ? faker.date.recent({ refDate: withdrawnAt })
        : null;
    const returnedAt =
      faker.datatype.boolean() && deliveredAt
        ? faker.date.recent({ refDate: deliveredAt })
        : null;

    const order = await client.order.create({
      data: {
        description: faker.lorem.text(),
        recipientId: faker.helpers.arrayElement(factory.recipients).id,
        postedAt,
        withdrawnAt,
        deliveredAt,
        returnedAt,
        deliverymanId: withdrawnAt
          ? faker.helpers.arrayElement(factory.users).id
          : null,
      },
    });

    factory.orders.push(order);
  }
}
