import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { SignInUseCase } from "@/domain/account/application/use-cases/sign-in";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const signInBodySchema = z.object({
  cpf: z.string().min(11).max(11).transform(Number),
  password: z.string().min(6),
});

const bodyValidationPipe = new ZodValidationPipe(signInBodySchema);

type SignInBodySchema = z.infer<typeof signInBodySchema>;

@Public()
@Controller({ path: "/sign-in", version: "v1" })
export class SignInController {
  constructor(private signIn: SignInUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: SignInBodySchema) {
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
