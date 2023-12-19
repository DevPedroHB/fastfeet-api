import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  IOrderAttachment,
  OrderAttachment,
} from "@/domain/order/enterprise/entities/order-attachment";

export function makeOrderAttachment(
  override: Partial<IOrderAttachment> = {},
  id?: UniqueEntityID,
) {
  const orderAttachment = OrderAttachment.create(
    {
      orderId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return orderAttachment;
}
