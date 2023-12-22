import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

interface WithdrawOrderUseCaseRequest {
  orderId: string;
  deliverymanId: string;
}

type WithdrawOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class WithdrawOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    orderId,
    deliverymanId,
  }: WithdrawOrderUseCaseRequest): Promise<WithdrawOrderUseCaseResponse> {
    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      return error(new ResourceNotFoundError());
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return error(new ResourceNotFoundError());
    }

    order.withdrawn(deliveryman.id);

    await this.ordersRepository.save(order);

    return success({
      order,
    });
  }
}
