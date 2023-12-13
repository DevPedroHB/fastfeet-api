import { PaginationParams } from "@/core/repositories/pagination-params";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { User } from "@/domain/account/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByCpf(cpf: number) {
    const item = this.items.find((item) => item.cpf === cpf);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyDeliverymen({ page, perPage }: PaginationParams) {
    const items = this.items
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => a.role.localeCompare(b.role))
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async create(user: User) {
    this.items.push(user);
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items[itemIndex] = user;
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items.splice(itemIndex, 1);
  }
}
