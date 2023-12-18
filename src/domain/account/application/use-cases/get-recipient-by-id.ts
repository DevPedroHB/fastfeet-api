import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { UserRole } from "../../enterprise/entities/user";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { UsersRepository } from "../repositories/users-repository";

interface GetRecipientByIdUseCaseRequest {
  recipientId: string;
  administratorId: string;
}

type GetRecipientByIdUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class GetRecipientByIdUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    recipientId,
    administratorId,
  }: GetRecipientByIdUseCaseRequest): Promise<GetRecipientByIdUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return error(new ResourceNotFoundError());
    }

    return success({
      recipient,
    });
  }
}
