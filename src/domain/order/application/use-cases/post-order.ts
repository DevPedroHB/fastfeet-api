import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { OrdersRepository } from "@/domain/order/application/repositories/orders-repository";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Order } from "../../enterprise/entities/order";

interface PostOrderUseCaseRequest {
  orderId: string;
  administratorId: string;
}

type PostOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class PostOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    orderId,
    administratorId,
  }: PostOrderUseCaseRequest): Promise<PostOrderUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return error(new ResourceNotFoundError());
    }

    order.post();

    await this.ordersRepository.save(order);

    return success({
      order,
    });
  }
}
