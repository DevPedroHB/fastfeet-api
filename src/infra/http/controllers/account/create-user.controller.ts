import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateUserUseCase } from "@/domain/account/application/use-cases/create-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  CreateUserBodyDto,
  createUserBodyPipe,
} from "../../dtos/account/create-user.dto";

@ApiTags("users")
@ApiBearerAuth("token")
@Controller({ path: "/users", version: "v1" })
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  async handle(
    @Body(createUserBodyPipe) body: CreateUserBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password, role } = body;

    const result = await this.createUser.execute({
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
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
