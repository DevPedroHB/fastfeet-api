import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface IOrderAttachment {
  orderId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class OrderAttachment extends Entity<IOrderAttachment> {
  get orderId() {
    return this.props.orderId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: IOrderAttachment, id?: UniqueEntityID) {
    const orderAttachment = new OrderAttachment(props, id);

    return orderAttachment;
  }
}
