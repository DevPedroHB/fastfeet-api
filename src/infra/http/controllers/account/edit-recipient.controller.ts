import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditRecipientUseCase } from "@/domain/account/application/use-cases/edit-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const editRecipientBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(14).max(14),
  zipCode: z.string().min(8).max(8),
  number: z.coerce.number(),
});

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema);

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>;

@Controller({ path: "/recipients/:id", version: "v1" })
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") recipientId: string,
  ) {
    const { name, cpf, zipCode, number } = body;

    const result = await this.editRecipient.execute({
      recipientId,
      name,
      cpf,
      zipCode,
      number,
      administratorId: user.sub,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
