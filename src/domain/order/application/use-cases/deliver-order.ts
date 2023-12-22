import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrderAttachment } from "../../enterprise/entities/order-attachment";
import { OrderAttachmentList } from "../../enterprise/entities/order-attachment-list";
import { OrderAttachmentsRepository } from "../repositories/order-attachments-repository";
import { OrdersRepository } from "../repositories/orders-repository";

interface DeliverOrderUseCaseRequest {
  orderId: string;
  attachmentsIds: string[];
  deliverymanId: string;
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
  ) {}

  async execute({
    orderId,
    attachmentsIds,
    deliverymanId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      return error(new ResourceNotFoundError());
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return error(new ResourceNotFoundError());
    }

    if (!order.deliverymanId?.equals(deliveryman.id)) {
      return error(new NotAllowedError());
    }

    const currentOrderAttachments =
      await this.orderAttachmentsRepository.findManyByOrderId(
        order.id.toString(),
      );

    const orderAttachmentList = new OrderAttachmentList(
      currentOrderAttachments,
    );

    const orderAttachments = attachmentsIds.map((attachmentId) => {
      return OrderAttachment.create({
        orderId: order.id,
        attachmentId: new UniqueEntityID(attachmentId),
      });
    });

    orderAttachmentList.update(orderAttachments);

    order.attachments = orderAttachmentList;
    order.delivered();

    await this.ordersRepository.save(order);

    return success({
      order,
    });
  }
}
