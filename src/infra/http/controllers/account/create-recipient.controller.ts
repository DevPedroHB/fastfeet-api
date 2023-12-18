import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateRecipientUseCase } from "@/domain/account/application/use-cases/create-recipient";
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

const createRecipientBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(14).max(14),
  password: z.string().min(6),
  zipCode: z.string().min(8).max(8),
  number: z.coerce.number(),
});

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema);

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller({ path: "/recipients", version: "v1" })
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password, zipCode, number } = body;

    const result = await this.createRecipient.execute({
      name,
      cpf,
      password,
      zipCode,
      number,
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
