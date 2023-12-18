import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { UserRole } from "../../enterprise/entities/user";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { UsersRepository } from "../repositories/users-repository";

interface FetchRecipientsUseCaseRequest {
  page: number;
  perPage: number;
  administratorId: string;
}

type FetchRecipientsUseCaseResponse = Either<
  NotAllowedError,
  {
    recipients: Recipient[];
  }
>;

@Injectable()
export class FetchRecipientsUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    page,
    perPage,
    administratorId,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const recipients = await this.recipientsRepository.findMany({
      page,
      perPage,
    });

    return success({
      recipients,
    });
  }
}
