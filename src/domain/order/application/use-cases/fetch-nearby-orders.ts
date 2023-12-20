import { Either, success } from "@/core/either";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

interface FetchNearbyOrdersUseCaseRequest {
  latitude: number;
  longitude: number;
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

export class FetchNearbyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyNearby({
      latitude,
      longitude,
    });

    return success({
      orders,
    });
  }
}
