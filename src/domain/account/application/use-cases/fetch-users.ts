import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface FetchUsersUseCaseRequest {
  page: number;
  perPage: number;
  administratorId: string;
}

type FetchUsersUseCaseResponse = Either<
  NotAllowedError,
  {
    users: User[];
  }
>;

@Injectable()
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    perPage,
    administratorId,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const users = await this.usersRepository.findMany({
      page,
      perPage,
    });

    return success({
      users,
    });
  }
}
