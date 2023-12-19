import { OrderAttachmentsRepository } from "@/domain/order/application/repositories/order-attachments-repository";
import { OrderAttachment } from "@/domain/order/enterprise/entities/order-attachment";

export class InMemoryOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  public items: OrderAttachment[] = [];

  async findManyByOrderId(orderId: string) {
    const items = this.items.filter(
      (item) => item.orderId.toString() === orderId,
    );

    return items;
  }

  async createMany(attachments: OrderAttachment[]) {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: OrderAttachment[]) {
    const newItems = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = newItems;
  }

  async deleteManyByOrderId(orderId: string) {
    const newItems = this.items.filter(
      (item) => item.orderId.toString() !== orderId,
    );

    this.items = newItems;
  }
}
