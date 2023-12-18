import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { RecipientAddress } from "@/domain/account/enterprise/entities/value-objects/recipient-address";
import { Recipient as PrismaRecipient } from "@prisma/client";

export class PrismaRecipientAddressMapper {
  static toDomain(raw: PrismaRecipient): RecipientAddress {
    return RecipientAddress.create({
      recipientId: new UniqueEntityID(raw.id),
      zipCode: raw.zipCode,
      state: raw.state,
      city: raw.city,
      neighborhood: raw.neighborhood,
      street: raw.street,
      number: raw.number,
      latitude: raw.latitude,
      longitude: raw.longitude,
    });
  }
}
