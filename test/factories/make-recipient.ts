import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  IRecipient,
  Recipient,
} from "@/domain/account/enterprise/entities/recipient";
import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import { faker } from "@faker-js/faker";

export function makeRecipient(
  override: Partial<IRecipient> = {},
  id?: UniqueEntityID,
) {
  const cpf = faker.helpers.replaceSymbols("###.###.###-##");

  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(cpf),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return recipient;
}
