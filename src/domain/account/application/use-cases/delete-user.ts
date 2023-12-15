import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface DeleteUserUseCaseRequest {
  userId: string;
  administratorId: string;
}

type DeleteUserUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    administratorId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return error(new ResourceNotFoundError());
    }

    await this.usersRepository.delete(user);

    return success(null);
  }
}
