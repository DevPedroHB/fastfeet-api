import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { PostOrderUseCase } from "@/domain/order/application/use-cases/post-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/orders/:id/post", version: "v1" })
export class PostOrderController {
  constructor(private postOrder: PostOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") orderId: string) {
    const result = await this.postOrder.execute({
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
