import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { OrderAttachmentList } from "./order-attachment-list";

export interface IOrder {
  description: string;
  attachments: OrderAttachmentList;
  postedAt?: Date | null;
  withdrawnAt?: Date | null;
  deliveredAt?: Date | null;
  returnedAt?: Date | null;
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

  get recipientId() {
    return this.props.recipientId;
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  post() {
    this.props.postedAt = new Date();
  }

  withdrawn(deliverymanId: UniqueEntityID) {
    this.props.deliverymanId = deliverymanId;
    this.props.withdrawnAt = new Date();
  }

  delivered() {
    this.props.deliveredAt = new Date();
  }

  returned() {
    this.props.returnedAt = new Date();
  }

  static create(props: Optional<IOrder, "attachments">, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        attachments: props.attachments ?? new OrderAttachmentList(),
      },
      id,
    );

    return order;
  }
}
