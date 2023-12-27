import { PrismaClient } from "@prisma/client";
import { Factory } from "prisma/seed";

interface IFabricateNotification {
  client: PrismaClient;
  factory: Factory;
}

export async function fabricateNotification({
  client,
  factory,
}: IFabricateNotification) {
  for (const order of factory.orders) {
    if (order.postedAt) {
      const notification = await client.notification.create({
        data: {
          title: `Novo status em "${order.description}"`,
          content: `A encomenda "${order.description}" foi postada.`,
          recipientId: order.recipientId,
        },
      });

      factory.notifications.push(notification);
    }

    if (order.withdrawnAt) {
      const notification = await client.notification.create({
        data: {
          title: `Novo status em "${order.description}"`,
          content: `A encomenda "${order.description}" foi retirada para entrega.`,
          recipientId: order.recipientId,
        },
      });

      factory.notifications.push(notification);
    }

    if (order.deliveredAt) {
      const notification = await client.notification.create({
        data: {
          title: `Novo status em "${order.description}"`,
          content: `A encomenda "${order.description}" foi marcada como entregue.`,
          recipientId: order.recipientId,
        },
      });

      factory.notifications.push(notification);
    }

    if (order.returnedAt) {
      const notification = await client.notification.create({
        data: {
          title: `Novo status em "${order.description}"`,
          content: `A encomenda "${order.description}" foi marcada como devolvida.`,
          recipientId: order.recipientId,
        },
      });

      factory.notifications.push(notification);
    }
  }
}
