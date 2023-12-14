import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/account/enterprise/entities/user";
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
        cpf: Number(raw.cpf),
        password: raw.password,
        role: UserRole[raw.role],
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: BigInt(user.cpf),
      password: user.password,
      role: PrismaUserRole[user.role],
    };
  }
}
