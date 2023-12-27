import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
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
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@ApiBearerAuth("token")
@Controller({ path: "/users/:id", version: "v1" })
export class GetUserByIdController {
  constructor(private getUserById: GetUserByIdUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload, @Param("id") userId: string) {
    const result = await this.getUserById.execute({
      userId,
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
      user: UserPresenter.toHTTP(result.value.user),
    };
  }
}
