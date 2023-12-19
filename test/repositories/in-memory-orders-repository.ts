import { PaginationParams } from "@/core/repositories/pagination-params";
import { OrdersRepository } from "@/domain/order/application/repositories/orders-repository";
import { Order } from "@/domain/order/enterprise/entities/order";
import { InMemoryOrderAttachmentsRepository } from "./in-memory-order-attachments-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(
    private orderAttachmentsRepository: InMemoryOrderAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.deliverymanId?.toString() === deliverymanId)
      .sort((a, b) => b.withdrawnAt!.getTime() - a.withdrawnAt!.getTime())
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async findManyByRecipientId(
    recipientId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.recipientId?.toString() === recipientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async create(order: Order) {
    this.items.push(order);
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[itemIndex] = order;

    await this.orderAttachmentsRepository.createMany(
      order.attachments.getNewItems(),
    );

    await this.orderAttachmentsRepository.deleteMany(
      order.attachments.getRemovedItems(),
    );
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(itemIndex, 1);

    await this.orderAttachmentsRepository.deleteManyByOrderId(
      order.id.toString(),
    );
  }
}
