import { CreateOrderUseCase } from "@/domain/order/application/use-cases/create-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const createOrderBodySchema = z.object({
  description: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema);

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller({ path: "/orders", version: "v1" })
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
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
