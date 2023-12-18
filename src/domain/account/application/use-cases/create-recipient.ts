import { Either, error, success } from "@/core/either";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { UserRole } from "../../enterprise/entities/user";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { RecipientAddress } from "../../enterprise/entities/value-objects/recipient-address";
import { Hasher } from "../cryptography/hasher";
import { Locator } from "../location/locator";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { UsersRepository } from "../repositories/users-repository";

interface CreateRecipientUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  zipCode: string;
  number: number;
  administratorId: string;
}

type CreateRecipientUseCaseResponse = Either<
  NotAllowedError | AlreadyExistsError | ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private locator: Locator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    zipCode,
    number,
    administratorId,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const administrator = await this.usersRepository.findById(administratorId);

    if (!administrator || administrator.role !== UserRole.ADMINISTRATOR) {
      return error(new NotAllowedError());
    }

    const recipientWithSameCpf = await this.recipientsRepository.findByCpf(cpf);

    if (recipientWithSameCpf) {
      return error(new AlreadyExistsError("Recipient with same CPF"));
    }

    const hashedPassword = await this.hasher.hash(password);

    const recipient = Recipient.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    });

    const location = await this.locator.getLocationByZipCode(zipCode);

    if (!location) {
      return error(new ResourceNotFoundError());
    }

    const address = RecipientAddress.create({
      recipientId: recipient.id,
      ...location,
      number,
    });

    recipient.address = address;

    await this.recipientsRepository.create(recipient);

    return success({
      recipient,
    });
  }
}
