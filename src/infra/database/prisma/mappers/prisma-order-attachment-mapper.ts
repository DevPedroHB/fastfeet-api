import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderAttachment } from "@/domain/order/enterprise/entities/order-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error("Invalid attachment type.");
    }

    return OrderAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        orderId: new UniqueEntityID(raw.orderId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: OrderAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    );

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        orderId: attachments[0].orderId.toString(),
      },
    };
  }
}
