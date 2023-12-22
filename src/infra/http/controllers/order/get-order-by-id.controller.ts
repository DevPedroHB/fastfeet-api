import { GetOrderByIdUseCase } from "@/domain/order/application/use-cases/get-order-by-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { OrderPresenter } from "../../presenters/order-presenter";

@Controller({ path: "/orders/:id", version: "v1" })
export class GetOrderByIdController {
  constructor(private getOrderById: GetOrderByIdUseCase) {}

  @Get()
  async handle(@Param("id") orderId: string) {
    const result = await this.getOrderById.execute({
      orderId,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      order: OrderPresenter.toHTTP(result.value.order),
    };
  }
}
