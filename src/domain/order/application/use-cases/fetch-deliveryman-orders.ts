import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

interface FetchDeliverymanOrdersUseCaseRequest {
  deliverymanId: string;
  page: number;
  perPage: number;
}

type FetchDeliverymanOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchDeliverymanOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    deliverymanId,
    page,
    perPage,
  }: FetchDeliverymanOrdersUseCaseRequest): Promise<FetchDeliverymanOrdersUseCaseResponse> {
    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      return error(new ResourceNotFoundError());
    }

    const orders = await this.ordersRepository.findManyByDeliverymanId(
      deliveryman.id.toString(),
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
