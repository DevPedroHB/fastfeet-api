import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditRecipientPasswordUseCase } from "@/domain/account/application/use-cases/edit-recipient-password";
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
  EditRecipientPasswordBodyDto,
  editRecipientPasswordBodyPipe,
} from "../../dtos/account/edit-recipient-password.dto";

@ApiTags("recipients")
@ApiBearerAuth("token")
@Controller({ path: "/recipients/:id/change-password", version: "v1" })
export class EditRecipientPasswordController {
  constructor(private editRecipientPassword: EditRecipientPasswordUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editRecipientPasswordBodyPipe) body: EditRecipientPasswordBodyDto,
    @CurrentUser() user: UserPayload,
    @Param("id") recipientId: string,
  ) {
    const { password } = body;

    const result = await this.editRecipientPassword.execute({
      recipientId,
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
