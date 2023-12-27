import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteOrderUseCase } from "@/domain/order/application/use-cases/delete-order";
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

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/orders/:id", version: "v1" })
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") orderId: string) {
    const result = await this.deleteOrder.execute({
      orderId,
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
