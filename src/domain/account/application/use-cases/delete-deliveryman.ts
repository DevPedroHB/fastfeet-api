import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string;
  administratorId: string;
}

type DeleteDeliverymanUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    deliverymanId,
    administratorId,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      return error(new ResourceNotFoundError());
    }

    await this.usersRepository.delete(deliveryman);

    return success(null);
  }
}
