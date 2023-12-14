import { Either, error, success } from "@/core/either";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { Hasher } from "../cryptography/hasher";
import { UsersRepository } from "../repositories/users-repository";

interface CreateDeliverymanUseCaseRequest {
  name: string;
  cpf: number;
  password: string;
  role?: string;
  administratorId: string;
}

type CreateDeliverymanUseCaseResponse = Either<
  NotAllowedError | AlreadyExistsError,
  {
    deliveryman: User;
  }
>;

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    name,
    cpf,
    password,
    role,
    administratorId,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const deliveryWithSameCpf = await this.usersRepository.findByCpf(cpf);

    if (deliveryWithSameCpf) {
      return error(new AlreadyExistsError("Deliveryman with same CPF"));
    }

    const hashedPassword = await this.hasher.hash(password);

    const deliveryman = User.create({
      name,
      cpf,
      password: hashedPassword,
      role: role && UserRole[role],
    });

    await this.usersRepository.create(deliveryman);

    return success({
      deliveryman,
    });
  }
}
