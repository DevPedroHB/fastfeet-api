import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/domain/order/enterprise/entities/order";
import { Prisma, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        description: raw.description,
        postedAt: raw.postedAt,
        withdrawnAt: raw.withdrawnAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
        createdAt: raw.createdAt,
        recipientId: new UniqueEntityID(raw.recipientId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      description: order.description,
      postedAt: order.postedAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      createdAt: order.createdAt,
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
    };
  }
}
