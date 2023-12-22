import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { OrderDeliveredEvent } from "../events/order-delivered-event";
import { OrderPostedEvent } from "../events/order-posted-event";
import { OrderReturnedEvent } from "../events/order-returned-event";
import { OrderWithdrawnEvent } from "../events/order-withdrawn-event";
import { OrderAttachmentList } from "./order-attachment-list";

export interface IOrder {
  description: string;
  attachments: OrderAttachmentList;
  postedAt?: Date | null;
  withdrawnAt?: Date | null;
  deliveredAt?: Date | null;
  returnedAt?: Date | null;
  createdAt: Date;
  recipientId: UniqueEntityID;
  deliverymanId?: UniqueEntityID | null;
}

export class Order extends AggregateRoot<IOrder> {
  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: OrderAttachmentList) {
    this.props.attachments = attachments;
  }

  get postedAt() {
    return this.props.postedAt;
  }

  get withdrawnAt() {
    return this.props.withdrawnAt;
  }

  get deliveredAt() {
    return this.props.deliveredAt;
  }

  get returnedAt() {
    return this.props.returnedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  post() {
    if (!this.props.postedAt) {
      this.addDomainEvent(new OrderPostedEvent(this));
    }

    this.props.postedAt = new Date();
  }

  withdrawn(deliverymanId: UniqueEntityID) {
    if (!this.props.withdrawnAt) {
      this.addDomainEvent(new OrderWithdrawnEvent(this));
    }

    this.props.deliverymanId = deliverymanId;
    this.props.withdrawnAt = new Date();
  }

  delivered() {
    if (!this.props.deliveredAt) {
      this.addDomainEvent(new OrderDeliveredEvent(this));
    }

    this.props.deliveredAt = new Date();
  }

  returned() {
    if (!this.props.returnedAt) {
      this.addDomainEvent(new OrderReturnedEvent(this));
    }

    this.props.returnedAt = new Date();
  }

  static create(
    props: Optional<IOrder, "attachments" | "createdAt">,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        attachments: props.attachments ?? new OrderAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
