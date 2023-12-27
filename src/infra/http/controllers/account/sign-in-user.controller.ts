import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { SignInUserUseCase } from "@/domain/account/application/use-cases/sign-in-user";
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
  SignInUserBodyDto,
  signInUserBodyPipe,
} from "../../dtos/account/sign-in-user.dto";

@ApiTags("users")
@Public()
@Controller({ path: "/users/sign-in", version: "v1" })
export class SignInUserController {
  constructor(private signIn: SignInUserUseCase) {}

  @Post()
  async handle(@Body(signInUserBodyPipe) body: SignInUserBodyDto) {
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
