import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { UserRole } from "../../enterprise/entities/user";
import { Hasher } from "../cryptography/hasher";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { UsersRepository } from "../repositories/users-repository";

interface EditRecipientPasswordUseCaseRequest {
  recipientId: string;
  password: string;
  administratorId: string;
}

type EditRecipientPasswordUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class EditRecipientPasswordUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    recipientId,
    password,
    administratorId,
  }: EditRecipientPasswordUseCaseRequest): Promise<EditRecipientPasswordUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return error(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hasher.hash(password);

    recipient.password = hashedPassword;

    await this.recipientsRepository.save(recipient);

    return success({
      recipient,
    });
  }
}
