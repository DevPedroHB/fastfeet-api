import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { RecipientsRepository } from "@/domain/account/application/repositories/recipients-repository";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

interface FetchRecipientOrdersUseCaseRequest {
  recipientId: string;
  page: number;
  perPage: number;
}

type FetchRecipientOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

@Injectable()
export class FetchRecipientOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    recipientId,
    page,
    perPage,
  }: FetchRecipientOrdersUseCaseRequest): Promise<FetchRecipientOrdersUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return error(new ResourceNotFoundError());
    }

    const orders = await this.ordersRepository.findManyByRecipientId(
      recipient.id.toString(),
      {
        page,
        perPage,
      },
    );

    return success({
      orders,
    });
  }
}
