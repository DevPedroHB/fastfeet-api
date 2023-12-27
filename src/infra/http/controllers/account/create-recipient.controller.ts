import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateRecipientUseCase } from "@/domain/account/application/use-cases/create-recipient";
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
  CreateRecipientBodyDto,
  createRecipientBodyPipe,
} from "../../dtos/account/create-recipient.dto";

@ApiTags("recipients")
@ApiBearerAuth("token")
@Controller({ path: "/recipients", version: "v1" })
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  async handle(
    @Body(createRecipientBodyPipe) body: CreateRecipientBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password, zipCode, number } = body;

    const result = await this.createRecipient.execute({
      name,
      cpf,
      password,
      zipCode,
      number,
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
