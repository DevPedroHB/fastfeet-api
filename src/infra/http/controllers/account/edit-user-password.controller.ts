import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditUserPasswordUseCase } from "@/domain/account/application/use-cases/edit-user-password";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  EditUserPasswordBodyDto,
  editUserPasswordBodyPipe,
} from "../../dtos/account/edit-user-password.dto";

@ApiTags("users")
@ApiBearerAuth("token")
@Controller({ path: "/users/:id/change-password", version: "v1" })
export class EditUserPasswordController {
  constructor(private editUserPassword: EditUserPasswordUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editUserPasswordBodyPipe) body: EditUserPasswordBodyDto,
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
