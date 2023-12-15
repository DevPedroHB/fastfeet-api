import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { Hasher } from "../cryptography/hasher";
import { UsersRepository } from "../repositories/users-repository";

interface EditUserUseCaseRequest {
  userId: string;
  name: string;
  cpf: string;
  password?: string;
  role?: string;
  administratorId: string;
}

type EditUserUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    userId,
    name,
    cpf,
    password,
    role,
    administratorId,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return error(new ResourceNotFoundError());
    }

    if (password) {
      const hashedPassword = await this.hasher.hash(password);

      user.password = hashedPassword;
    }

    user.name = name;
    user.cpf = cpf;
    user.role = role ? UserRole[role] : user.role;

    await this.usersRepository.save(user);

    return success({
      user,
    });
  }
}
