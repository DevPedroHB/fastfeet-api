import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditUserPasswordUseCase } from "@/domain/account/application/use-cases/edit-user-password";
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

const editUserPasswordBodySchema = z.object({
  password: z.string().min(6),
});

const bodyValidationPipe = new ZodValidationPipe(editUserPasswordBodySchema);

type EditUserPasswordBodySchema = z.infer<typeof editUserPasswordBodySchema>;

@Controller({ path: "/users/:id/change-password", version: "v1" })
export class EditUserPasswordController {
  constructor(private editUserPassword: EditUserPasswordUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserPasswordBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") userId: string,
  ) {
    const { password } = body;

    const result = await this.editUserPassword.execute({
      userId,
      password,
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
