import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@ApiBearerAuth("token")
@Controller({ path: "/users/:id", version: "v1" })
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") userId: string) {
    const result = await this.deleteUser.execute({
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
  }
}
