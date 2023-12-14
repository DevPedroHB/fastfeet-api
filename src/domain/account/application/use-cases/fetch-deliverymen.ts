import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface FetchDeliverymenUseCaseRequest {
  page: number;
  perPage: number;
  administratorId: string;
}

type FetchDeliverymenUseCaseResponse = Either<
  NotAllowedError,
  {
    deliverymen: User[];
  }
>;

@Injectable()
export class FetchDeliverymenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    perPage,
    administratorId,
  }: FetchDeliverymenUseCaseRequest): Promise<FetchDeliverymenUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const deliverymen = await this.usersRepository.findManyDeliverymen({
      page,
      perPage,
    });

    return success({
      deliverymen,
    });
  }
}
