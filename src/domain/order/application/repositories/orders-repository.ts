import { PaginationParams } from "@/core/repositories/pagination-params";
import { Order } from "../../enterprise/entities/order";

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<Order[]>;
  abstract findManyByRecipientId(
    recipientId: string,
    params: PaginationParams,
  ): Promise<Order[]>;
  abstract create(order: Order): Promise<void>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
}
