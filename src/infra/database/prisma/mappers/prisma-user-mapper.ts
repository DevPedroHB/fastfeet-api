import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/account/enterprise/entities/user";
import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import {
  Prisma,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from "@prisma/client";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        cpf: CPF.create(raw.cpf),
        password: raw.password,
        role: UserRole[raw.role],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf.value,
      password: user.password,
      role: PrismaUserRole[user.role],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
