import { PaginationParams } from "@/core/repositories/pagination-params";
import { RecipientsRepository } from "@/domain/account/application/repositories/recipients-repository";
import { Recipient } from "@/domain/account/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByCpf(cpf: string) {
    const item = this.items.find((item) => item.cpf.value === cpf);

    if (!item) {
      return null;
    }

    return item;
  }

  async findMany({ page, perPage }: PaginationParams) {
    const items = this.items
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async create(recipient: Recipient) {
    this.items.push(recipient);
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id);

    this.items[itemIndex] = recipient;
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id);

    this.items.splice(itemIndex, 1);
  }
}
