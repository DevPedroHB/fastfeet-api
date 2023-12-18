import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  IRecipient,
  Recipient,
} from "@/domain/account/enterprise/entities/recipient";
import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeRecipientAddress } from "./make-recipient-address";

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

  recipient.address = makeRecipientAddress({
    recipientId: recipient.id,
  });

  return recipient;
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<IRecipient> = {}) {
    const recipient = makeRecipient(data);

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    return recipient;
  }
}
