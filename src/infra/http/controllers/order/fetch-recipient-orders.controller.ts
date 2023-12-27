import { FetchRecipientOrdersUseCase } from "@/domain/order/application/use-cases/fetch-recipient-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  FetchRecipientOrdersQueryDto,
  fetchRecipientOrdersQueryPipe,
} from "../../dtos/order/fetch-recipient-orders.dto";
import { OrderPresenter } from "../../presenters/order-presenter";

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/recipient/orders", version: "v1" })
export class FetchRecipientOrdersController {
  constructor(private fetchRecipientOrders: FetchRecipientOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(fetchRecipientOrdersQueryPipe) query: FetchRecipientOrdersQueryDto,
  ) {
    const { page, perPage } = query;

    const result = await this.fetchRecipientOrders.execute({
      recipientId: user.sub,
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
