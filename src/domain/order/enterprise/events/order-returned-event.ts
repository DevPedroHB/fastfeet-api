import { DomainEvent } from "@/core/events/domain-event";
import { Order } from "../entities/order";

export class OrderReturnedEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;

  constructor(order: Order) {
    this.ocurredAt = new Date();
    this.order = order;
  }

  getAggregateId() {
    return this.order.id;
  }
}
