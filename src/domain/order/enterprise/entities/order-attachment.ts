import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Attachment, IAttachment } from "./attachment";

export interface IOrderAttachment extends IAttachment {
  orderId: UniqueEntityID;
}

export class OrderAttachment extends Attachment<IOrderAttachment> {
  get orderId() {
    return this.props.orderId;
  }

  static create(props: IOrderAttachment, id?: UniqueEntityID) {
    const orderAttachment = new OrderAttachment(props, id);

    return orderAttachment;
  }
}
