import { AttachmentsRepository } from "@/domain/order/application/repositories/attachments-repository";
import { Attachment } from "@/domain/order/enterprise/entities/attachment";
import { Injectable } from "@nestjs/common";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment) {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
