import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  IOrderAttachment,
  OrderAttachment,
} from "@/domain/order/enterprise/entities/order-attachment";
import { faker } from "@faker-js/faker";

export function makeOrderAttachment(
  override: Partial<IOrderAttachment> = {},
  id?: UniqueEntityID,
) {
  const attachment = OrderAttachment.create(
    {
      title: faker.lorem.sentence(),
      url: faker.image.url(),
      orderId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return attachment;
}
