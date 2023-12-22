import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface INotification {
  title: string;
  content: string;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  recipientId: UniqueEntityID;
}

export class Notification extends Entity<INotification> {
  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<INotification, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return notification;
  }
}
