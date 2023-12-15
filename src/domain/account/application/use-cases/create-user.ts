import { Either, error, success } from "@/core/either";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { Hasher } from "../cryptography/hasher";
import { UsersRepository } from "../repositories/users-repository";

interface CreateUserUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  role?: string;
  administratorId: string;
}

type CreateUserUseCaseResponse = Either<
  NotAllowedError | AlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
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
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const deliveryWithSameCpf = await this.usersRepository.findByCpf(cpf);

    if (deliveryWithSameCpf) {
      return error(new AlreadyExistsError("User with same CPF"));
    }

    const hashedPassword = await this.hasher.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
      role: role && UserRole[role],
    });

    await this.usersRepository.create(user);

    return success({
      user,
    });
  }
}
