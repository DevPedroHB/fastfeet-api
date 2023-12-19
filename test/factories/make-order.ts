import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IOrder, Order } from "@/domain/order/enterprise/entities/order";
import { faker } from "@faker-js/faker";

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
