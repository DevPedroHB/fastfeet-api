import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { Factory } from "prisma/seed";

interface IFabricateAttachment {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateAttachment({
  client,
  faker,
  factory,
}: IFabricateAttachment) {
  const orders = factory.orders.filter((order) => order.deliveredAt);

  if (orders.length === 0) {
    return;
  }

  for (const order of orders) {
    const attachment = await client.attachment.create({
      data: {
        title: faker.lorem.sentence(),
        url: faker.image.url(),
        orderId: order.id,
      },
    });

    factory.attachments.push(attachment);
  }
}
