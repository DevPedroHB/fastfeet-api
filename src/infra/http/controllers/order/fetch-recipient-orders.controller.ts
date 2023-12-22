import { FetchRecipientOrdersUseCase } from "@/domain/order/application/use-cases/fetch-recipient-orders";
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

@Controller({ path: "/recipient/orders", version: "v1" })
export class FetchRecipientOrdersController {
  constructor(private fetchRecipientOrders: FetchRecipientOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query("page", queryValidationPipe) page: PageQuerySchema,
  ) {
    const result = await this.fetchRecipientOrders.execute({
      recipientId: user.sub,
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
