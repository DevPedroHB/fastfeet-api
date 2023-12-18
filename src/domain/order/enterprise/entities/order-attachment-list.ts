import { WatchedList } from "@/core/entities/watched-list";
import { OrderAttachment } from "./order-attachment";

export class OrderAttachmentList extends WatchedList<OrderAttachment> {
  compareItems(a: OrderAttachment, b: OrderAttachment) {
    return a.id.equals(b.id);
  }
}
