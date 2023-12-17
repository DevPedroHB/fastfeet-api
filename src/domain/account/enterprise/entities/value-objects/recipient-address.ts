import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Address, IAddress } from "./address";

export interface IRecipientAddress extends IAddress {
  recipientId: UniqueEntityID;
}

export class RecipientAddress extends Address<IRecipientAddress> {
  get recipientId() {
    return this.props.recipientId;
  }

  static create(props: IRecipientAddress) {
    return new RecipientAddress(props);
  }
}
