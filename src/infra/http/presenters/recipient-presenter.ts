import { Recipient } from "@/domain/account/enterprise/entities/recipient";

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    if (!recipient.address) {
      throw new Error("Invalid address.");
    }

    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value,
      address: {
        zipCode: recipient.address.zipCode,
        state: recipient.address.state,
        city: recipient.address.city,
        neighborhood: recipient.address.neighborhood,
        street: recipient.address.street,
        number: recipient.address.number,
        latitude: recipient.address.latitude,
        longitude: recipient.address.longitude,
      },
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }
}
