import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateRecipient {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateRecipient({
  client,
  faker,
  factory,
}: IFabricateRecipient) {
  const l = 10;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const hashedPassword = await hash(faker.internet.password(), 8);
    const coordinates = faker.location.nearbyGPSCoordinate();

    const recipient = await client.recipient.create({
      data: {
        name: faker.person.fullName(),
        cpf: faker.helpers.replaceSymbols("###.###.###-##"),
        password: hashedPassword,
        zipCode: faker.location.zipCode("########"),
        state: faker.location.state({ abbreviated: true }),
        city: faker.location.city(),
        neighborhood: faker.location.country(),
        street: faker.location.street(),
        number: faker.number.int({ min: 1, max: 9999 }),
        latitude: coordinates[0],
        longitude: coordinates[1],
      },
    });

    factory.recipients.push(recipient);
  }
}
