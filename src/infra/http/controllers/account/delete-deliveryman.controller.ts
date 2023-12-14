import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteDeliverymanUseCase } from "@/domain/account/application/use-cases/delete-deliveryman";
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

@Controller({ path: "/users/:id", version: "v1" })
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") deliverymanId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteDeliveryman.execute({
      deliverymanId,
      administratorId: userId,
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
