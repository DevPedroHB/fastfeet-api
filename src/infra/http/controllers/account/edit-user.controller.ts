import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditUserUseCase } from "@/domain/account/application/use-cases/edit-user";
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
  EditUserBodyDto,
  editUserBodyPipe,
} from "../../dtos/account/edit-user.dto";

@ApiTags("users")
@ApiBearerAuth("token")
@Controller({ path: "/users/:id", version: "v1" })
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editUserBodyPipe) body: EditUserBodyDto,
    @CurrentUser() user: UserPayload,
    @Param("id") userId: string,
  ) {
    const { name, cpf, role } = body;

    const result = await this.editUser.execute({
      userId,
      name,
      cpf,
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
