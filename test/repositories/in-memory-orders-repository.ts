import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import {
  FindManyNearbyParams,
  OrdersRepository,
} from "@/domain/order/application/repositories/orders-repository";
import { Order } from "@/domain/order/enterprise/entities/order";
import { getDistanceBetweenCoordinates } from "test/utils/get-distance-between-coordinates";
import { InMemoryOrderAttachmentsRepository } from "./in-memory-order-attachments-repository";
import { InMemoryRecipientsRepository } from "./in-memory-recipients-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(
    private orderAttachmentsRepository: InMemoryOrderAttachmentsRepository,
    private recipientsRepository: InMemoryRecipientsRepository,
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

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 1;

    const items = this.items
      .filter((item) => {
        const recipient = this.recipientsRepository.items.find((recipient) =>
          recipient.id.equals(item.recipientId),
        );

        if (!recipient) {
          throw new Error(
            `Recipient with ID ${item.recipientId.toString()} does not exist.`,
          );
        }

        if (!recipient.address) {
          throw new Error(`Recipient address not found.`);
        }

        const distance = getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: recipient.address.latitude,
            longitude: recipient.address.longitude,
          },
        );

        return distance < MAX_DISTANCE_IN_KILOMETERS;
      })
      .filter(
        (item) => item.postedAt && !item.deliverymanId && !item.withdrawnAt,
      );

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

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(itemIndex, 1);

    await this.orderAttachmentsRepository.deleteManyByOrderId(
      order.id.toString(),
    );
  }
}
