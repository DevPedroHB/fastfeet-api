import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CPF } from "./value-objects/cpf";
import { RecipientAddress } from "./value-objects/recipient-address";

export interface IRecipient {
  name: string;
  cpf: CPF;
  password: string;
  address: RecipientAddress | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Recipient extends Entity<IRecipient> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;

    this.touch();
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: CPF) {
    this.props.cpf = cpf;

    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;

    this.touch();
  }

  get address() {
    return this.props.address;
  }

  set address(address: RecipientAddress | null) {
    this.props.address = address;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<IRecipient, "address" | "createdAt">,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        address: null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return recipient;
  }
}
