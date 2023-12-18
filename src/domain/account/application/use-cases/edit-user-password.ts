import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { Hasher } from "../cryptography/hasher";
import { UsersRepository } from "../repositories/users-repository";

interface EditUserPasswordUseCaseRequest {
  userId: string;
  password: string;
  administratorId: string;
}

type EditUserPasswordUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    userId,
    password,
    administratorId,
  }: EditUserPasswordUseCaseRequest): Promise<EditUserPasswordUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return error(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hasher.hash(password);

    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return success({
      user,
    });
  }
}
