import { OrderAttachment } from "./../../enterprise/entities/order-attachment";

export abstract class OrderAttachmentsRepository {
  abstract findManyByOrderId(orderId: string): Promise<OrderAttachment[]>;
  abstract createMany(attachments: OrderAttachment[]): Promise<void>;
  abstract deleteMany(attachments: OrderAttachment[]): Promise<void>;
  abstract deleteManyByOrderId(orderId: string): Promise<void>;
}
