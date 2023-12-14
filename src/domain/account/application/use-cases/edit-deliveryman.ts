import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface EditDeliverymanUseCaseRequest {
  deliverymanId: string;
  name: string;
  cpf: number;
  role?: string;
  administratorId: string;
}

type EditDeliverymanUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    deliveryman: User;
  }
>;

@Injectable()
export class EditDeliverymanUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    deliverymanId,
    name,
    cpf,
    role,
    administratorId,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      return error(new ResourceNotFoundError());
    }

    deliveryman.name = name;
    deliveryman.cpf = cpf;
    deliveryman.role = role ? UserRole[role] : deliveryman.role;

    await this.usersRepository.save(deliveryman);

    return success({
      deliveryman,
    });
  }
}
