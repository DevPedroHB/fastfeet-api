import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { UsersRepository } from "../repositories/users-repository";

interface EditUserUseCaseRequest {
  userId: string;
  name: string;
  cpf: string;
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
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    cpf,
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

    user.name = name;
    user.cpf = CPF.create(cpf);
    user.role = role ? UserRole[role] : user.role;

    await this.usersRepository.save(user);

    return success({
      user,
    });
  }
}
