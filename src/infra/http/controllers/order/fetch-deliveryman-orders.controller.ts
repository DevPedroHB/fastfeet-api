import { FetchDeliverymanOrdersUseCase } from "@/domain/order/application/use-cases/fetch-deliveryman-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  FetchDeliverymanOrdersQueryDto,
  fetchDeliverymanOrdersQueryPipe,
} from "../../dtos/order/fetch-deliveryman-orders.dto";
import { OrderPresenter } from "../../presenters/order-presenter";

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/deliveryman/orders", version: "v1" })
export class FetchDeliverymanOrdersController {
  constructor(private fetchDeliverymanOrders: FetchDeliverymanOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(fetchDeliverymanOrdersQueryPipe)
    query: FetchDeliverymanOrdersQueryDto,
  ) {
    const { page, perPage } = query;

    const result = await this.fetchDeliverymanOrders.execute({
      deliverymanId: user.sub,
      page,
      perPage,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      orders: result.value.orders.map(OrderPresenter.toHTTP),
    };
  }
}
