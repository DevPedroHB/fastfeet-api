import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  IRecipientAddress,
  RecipientAddress,
} from "@/domain/account/enterprise/entities/value-objects/recipient-address";
import { faker } from "@faker-js/faker";

export function makeRecipientAddress(
  override: Partial<IRecipientAddress> = {},
  id?: UniqueEntityID,
) {
  const coordinates = faker.location.nearbyGPSCoordinate();

  const address = RecipientAddress.create({
    recipientId: new UniqueEntityID(),
    zipCode: faker.location.zipCode("########"),
    state: faker.location.state({ abbreviated: true }),
    city: faker.location.city(),
    neighborhood: faker.location.country(),
    street: faker.location.street(),
    number: faker.number.int({ min: 1, max: 9999 }),
    latitude: coordinates[0],
    longitude: coordinates[1],
    ...override,
  });

  return address;
}
