import { WatchedList } from "@/core/entities/watched-list";
import { OrderAttachment } from "./order-attachment";

export interface IOrderAttachmentList {
  createdAt: Date;
  updatedAt?: Date | null;
}

export class OrderAttachmentList extends WatchedList<OrderAttachment> {
  compareItems(a: OrderAttachment, b: OrderAttachment) {
    return a.attachmentId.equals(b.attachmentId);
  }
}
