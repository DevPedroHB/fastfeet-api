import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { UserRole } from "../../enterprise/entities/user";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { RecipientAddress } from "../../enterprise/entities/value-objects/recipient-address";
import { Locator } from "../location/locator";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { UsersRepository } from "../repositories/users-repository";

interface EditRecipientUseCaseRequest {
  recipientId: string;
  name: string;
  cpf: string;
  zipCode: string;
  number: number;
  administratorId: string;
}

type EditRecipientUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
    private locator: Locator,
  ) {}

  async execute({
    recipientId,
    name,
    cpf,
    zipCode,
    number,
    administratorId,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return error(new ResourceNotFoundError());
    }

    const location = await this.locator.getLocationByZipCode(zipCode);

    if (!location) {
      return error(new ResourceNotFoundError());
    }

    const address = RecipientAddress.create({
      recipientId: recipient.id,
      ...location,
      number,
    });

    recipient.name = name;
    recipient.cpf = CPF.create(cpf);
    recipient.address = address;

    await this.recipientsRepository.save(recipient);

    return success({
      recipient,
    });
  }
}
