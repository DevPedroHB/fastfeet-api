import { WithdrawOrderUseCase } from "@/domain/order/application/use-cases/withdraw-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/orders/:id/withdraw", version: "v1" })
export class WithdrawOrderController {
  constructor(private withdrawOrder: WithdrawOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") orderId: string) {
    const result = await this.withdrawOrder.execute({
      orderId,
      deliverymanId: user.sub,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
