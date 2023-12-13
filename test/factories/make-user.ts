import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IUser, User } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";

export function makeUser(override: Partial<IUser> = {}, id?: UniqueEntityID) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      cpf: Number(faker.helpers.replaceSymbols("###########")),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}
