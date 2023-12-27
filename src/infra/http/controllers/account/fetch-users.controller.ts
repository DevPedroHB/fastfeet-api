import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { FetchUsersUseCase } from "@/domain/account/application/use-cases/fetch-users";
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
  FetchUsersQueryDto,
  fetchUsersQueryPipe,
} from "../../dtos/account/fetch-users.dto";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@ApiBearerAuth("token")
@Controller({ path: "/users", version: "v1" })
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(fetchUsersQueryPipe) query: FetchUsersQueryDto,
  ) {
    const { page, perPage } = query;

    const result = await this.fetchUsers.execute({
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
      users: result.value.users.map(UserPresenter.toHTTP),
    };
  }
}
