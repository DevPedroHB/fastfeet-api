import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditRecipientUseCase } from "@/domain/account/application/use-cases/edit-recipient";
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
  EditRecipientBodyDto,
  editRecipientBodyPipe,
} from "../../dtos/account/edit-recipient.dto";

@ApiTags("recipients")
@ApiBearerAuth("token")
@Controller({ path: "/recipients/:id", version: "v1" })
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editRecipientBodyPipe) body: EditRecipientBodyDto,
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
