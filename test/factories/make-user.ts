import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IUser, User } from "@/domain/account/enterprise/entities/user";
import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeUser(override: Partial<IUser> = {}, id?: UniqueEntityID) {
  const cpf = faker.helpers.replaceSymbols("###.###.###-##");
  const user = User.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(cpf),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<IUser> = {}) {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
