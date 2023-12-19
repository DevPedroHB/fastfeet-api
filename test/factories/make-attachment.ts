import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  IAttachment,
} from "@/domain/order/enterprise/entities/attachment";
import { faker } from "@faker-js/faker";

export function makeAttachment(
  override: Partial<IAttachment> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug().toLowerCase().replace(".", ""),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  );

  return attachment;
}
