import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditUserUseCase } from "@/domain/account/application/use-cases/edit-user";
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

const editUserBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(11).max(11),
  password: z.string().min(6).optional(),
  role: z.enum(["ADMINISTRATOR", "USER"]).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema);

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;

@Controller({ path: "/users/:id", version: "v1" })
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") userId: string,
  ) {
    const { name, cpf, password, role } = body;

    const result = await this.editUser.execute({
      userId,
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
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
