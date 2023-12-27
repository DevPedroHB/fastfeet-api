import { CreateOrderUseCase } from "@/domain/order/application/use-cases/create-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  CreateOrderBodyDto,
  createOrderBodyPipe,
} from "../../dtos/order/create-order.dto";

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/orders", version: "v1" })
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(createOrderBodyPipe) body: CreateOrderBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { description } = body;

    const result = await this.createOrder.execute({
      description,
      recipientId: user.sub,
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
