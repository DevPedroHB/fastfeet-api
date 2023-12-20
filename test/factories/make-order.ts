import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IOrder, Order } from "@/domain/order/enterprise/entities/order";
import { PrismaOrderMapper } from "@/infra/database/prisma/mappers/prisma-order-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeOrder(override: Partial<IOrder> = {}, id?: UniqueEntityID) {
  const order = Order.create(
    {
      description: faker.lorem.text(),
      recipientId: new UniqueEntityID(),
      withdrawnAt: override.deliverymanId
        ? faker.date.recent({ days: 7 })
        : null,
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<IOrder> = {}) {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
