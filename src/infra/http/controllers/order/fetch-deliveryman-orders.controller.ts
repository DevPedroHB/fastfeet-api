import { FetchDeliverymanOrdersUseCase } from "@/domain/order/application/use-cases/fetch-deliveryman-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";
import { OrderPresenter } from "../../presenters/order-presenter";

const pageQuerySchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema);

type PageQuerySchema = z.infer<typeof pageQuerySchema>;

@Controller({ path: "/deliveryman/orders", version: "v1" })
export class FetchDeliverymanOrdersController {
  constructor(private fetchDeliverymanOrders: FetchDeliverymanOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query("page", queryValidationPipe) page: PageQuerySchema,
  ) {
    const result = await this.fetchDeliverymanOrders.execute({
      deliverymanId: user.sub,
      page,
      perPage: 20,
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