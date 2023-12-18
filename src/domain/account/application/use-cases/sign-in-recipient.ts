import { Either, error, success } from "@/core/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encypter";
import { Hasher } from "../cryptography/hasher";
import { RecipientsRepository } from "../repositories/recipients-repository";

interface SignInRecipientUseCaseRequest {
  cpf: string;
  password: string;
}

type SignInRecipientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    token: string;
  }
>;

@Injectable()
export class SignInRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hasher: Hasher,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: SignInRecipientUseCaseRequest): Promise<SignInRecipientUseCaseResponse> {
    const user = await this.recipientsRepository.findByCpf(cpf);

    if (!user) {
      return error(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hasher.compare(password, user.password);

    if (!isPasswordValid) {
      return error(new WrongCredentialsError());
    }

    const token = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return success({
      token,
    });
  }
}
