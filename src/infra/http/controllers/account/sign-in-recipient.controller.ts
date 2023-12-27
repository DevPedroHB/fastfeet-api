import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { SignInRecipientUseCase } from "@/domain/account/application/use-cases/sign-in-recipient";
import { Public } from "@/infra/auth/public";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  SignInRecipientBodyDto,
  signInRecipientBodyPipe,
} from "../../dtos/account/sign-in-recipient.dto";

@ApiTags("recipients")
@Public()
@Controller({ path: "/recipients/sign-in", version: "v1" })
export class SignInRecipientController {
  constructor(private signIn: SignInRecipientUseCase) {}

  @Post()
  async handle(@Body(signInRecipientBodyPipe) body: SignInRecipientBodyDto) {
    const { cpf, password } = body;

    const result = await this.signIn.execute({
      cpf,
      password,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      token: result.value.token,
    };
  }
}
