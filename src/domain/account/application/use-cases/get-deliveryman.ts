import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface GetDeliverymanUseCaseRequest {
  deliverymanId: string;
  administratorId: string;
}

type GetDeliverymanUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    deliveryman: User;
  }
>;

export class GetDeliverymanUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    deliverymanId,
    administratorId,
  }: GetDeliverymanUseCaseRequest): Promise<GetDeliverymanUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      return error(new ResourceNotFoundError());
    }

    return success({
      deliveryman,
    });
  }
}
