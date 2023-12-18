import { PaginationParams } from "@/core/repositories/pagination-params";
import { RecipientsRepository } from "@/domain/account/application/repositories/recipients-repository";
import { Recipient } from "@/domain/account/enterprise/entities/recipient";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}
  async findById(id: string) {
    const cacheHit = await this.cache.get(`recipient:${id}`);

    if (cacheHit) {
      return PrismaRecipientMapper.toDomain(JSON.parse(cacheHit));
    }

    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    });

    if (!recipient) {
      return null;
    }

    await this.cache.set(
      `recipient:${recipient.id}`,
      JSON.stringify(recipient),
    );

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findByCpf(cpf: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        cpf,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findMany({ page, perPage }: PaginationParams) {
    const recipients = await this.prisma.recipient.findMany({
      orderBy: {
        name: "asc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return recipients.map(PrismaRecipientMapper.toDomain);
  }

  async create(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }

  async save(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    });

    this.cache.delete(`recipient:${data.id}`);
  }

  async delete(recipient: Recipient) {
    await this.prisma.recipient.delete({
      where: {
        id: recipient.id.toString(),
      },
    });

    this.cache.delete(`recipient:${recipient.id.toString()}`);
  }
}
