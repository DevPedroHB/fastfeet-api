import { PaginationParams } from "@/core/repositories/pagination-params";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { User } from "@/domain/account/enterprise/entities/user";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}
  async findById(id: string) {
    const cacheHit = await this.cache.get(`user:${id}`);

    if (cacheHit) {
      return JSON.parse(cacheHit);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    const domain = PrismaUserMapper.toDomain(user);

    await this.cache.set(`user:${user.id}`, JSON.stringify(domain));

    return domain;
  }

  async findByCpf(cpf: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findManyDeliverymen({ page, perPage }: PaginationParams) {
    const users = await this.prisma.user.findMany({
      orderBy: [
        {
          role: "desc",
        },
        {
          name: "asc",
        },
      ],
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(user: User) {
    await this.prisma.user.delete({
      where: {
        id: user.id.toString(),
      },
    });
  }
}
