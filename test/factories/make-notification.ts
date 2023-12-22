import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  INotification,
  Notification,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";

export function makeNotification(
  override: Partial<INotification> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return notification;
}
