import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateUserUseCase } from "@/domain/account/application/use-cases/create-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const createUserBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(14).max(14),
  password: z.string().min(6),
  role: z.enum(["ADMINISTRATOR", "USER"]).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema);

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

@Controller({ path: "/users", version: "v1" })
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateUserBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password, role } = body;

    const result = await this.createUser.execute({
      name,
      cpf,
      password,
      role,
      administratorId: user.sub,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
