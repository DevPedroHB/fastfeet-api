import { AttachmentsRepository } from "@/domain/order/application/repositories/attachments-repository";
import { Attachment } from "@/domain/order/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
