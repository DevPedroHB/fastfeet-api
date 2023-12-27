import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { FetchRecipientsUseCase } from "@/domain/account/application/use-cases/fetch-recipients";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  FetchRecipientsQueryDto,
  fetchRecipientsQueryPipe,
} from "../../dtos/account/fetch-recipients.dto";
import { RecipientPresenter } from "../../presenters/recipient-presenter";

@ApiTags("recipients")
@ApiBearerAuth("token")
@Controller({ path: "/recipients", version: "v1" })
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(fetchRecipientsQueryPipe) query: FetchRecipientsQueryDto,
  ) {
    const { page, perPage } = query;

    const result = await this.fetchRecipients.execute({
      administratorId: user.sub,
      page,
      perPage,
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
      recipients: result.value.recipients.map(RecipientPresenter.toHTTP),
    };
  }
}
