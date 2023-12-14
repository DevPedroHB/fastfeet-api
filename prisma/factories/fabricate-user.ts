import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateUser {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateUser({
  client,
  faker,
  factory,
}: IFabricateUser) {
  const l = 10;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const hashedPassword = await hash(faker.internet.password(), 8);

    const user = await client.user.create({
      data: {
        name: faker.person.fullName(),
        cpf: Number(faker.helpers.replaceSymbols("###########")),
        password: hashedPassword,
      },
    });

    factory.users.push(user);
  }
}
