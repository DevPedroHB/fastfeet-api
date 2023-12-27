import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { GetRecipientByIdUseCase } from "@/domain/account/application/use-cases/get-recipient-by-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RecipientPresenter } from "../../presenters/recipient-presenter";

@ApiTags("recipients")
@ApiBearerAuth("token")
@Controller({ path: "/recipients/:id", version: "v1" })
export class GetRecipientByIdController {
  constructor(private getRecipientById: GetRecipientByIdUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") recipientId: string,
  ) {
    const result = await this.getRecipientById.execute({
      recipientId,
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

    return {
      recipient: RecipientPresenter.toHTTP(result.value.recipient),
    };
  }
}
