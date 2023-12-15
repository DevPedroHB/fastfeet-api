import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface GetUserByIdUseCaseRequest {
  userId: string;
  administratorId: string;
}

type GetUserByIdUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class GetUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    administratorId,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return error(new ResourceNotFoundError());
    }

    return success({
      user,
    });
  }
}
