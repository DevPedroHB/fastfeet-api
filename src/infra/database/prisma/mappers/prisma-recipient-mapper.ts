import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/domain/account/enterprise/entities/recipient";
import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import { Prisma, Recipient as PrismaRecipient } from "@prisma/client";
import { PrismaRecipientAddressMapper } from "./prisma-recipient-address-mapper";

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: CPF.create(raw.cpf),
        password: raw.password,
        address: PrismaRecipientAddressMapper.toDomain(raw),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    if (!recipient.address) {
      throw new Error("Invalid address.");
    }

    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value,
      password: recipient.password,
      zipCode: recipient.address.zipCode,
      state: recipient.address.state,
      city: recipient.address.city,
      neighborhood: recipient.address.neighborhood,
      street: recipient.address.street,
      number: recipient.address.number,
      latitude: recipient.address.latitude,
      longitude: recipient.address.longitude,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }
}
