import { OrderAttachmentsRepository } from "@/domain/order/application/repositories/order-attachments-repository";
import { OrderAttachment } from "@/domain/order/enterprise/entities/order-attachment";

export class InMemoryOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  public items: OrderAttachment[] = [];

  async create(attachment: OrderAttachment) {
    this.items.push(attachment);
  }
}
