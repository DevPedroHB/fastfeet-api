import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export enum UserRole {
  DELIVERYMAN = "DELIVERYMAN",
  ADMINISTRATOR = "ADMINISTRATOR",
}

export interface IUser {
  name: string;
  cpf: number;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<IUser> {
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

  set cpf(cpf: number) {
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

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;

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
    props: Optional<IUser, "role" | "createdAt">,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        role: props.role ?? UserRole.DELIVERYMAN,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
