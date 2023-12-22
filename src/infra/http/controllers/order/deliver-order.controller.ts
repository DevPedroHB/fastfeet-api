import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeliverOrderUseCase } from "@/domain/order/application/use-cases/deliver-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const deliverOrderBodySchema = z.object({
  attachmentsIds: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema);

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>;

@Controller({ path: "/orders/:id/deliver", version: "v1" })
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") orderId: string,
  ) {
    const { attachmentsIds } = body;

    const result = await this.deliverOrder.execute({
      orderId,
      attachmentsIds,
      deliverymanId: user.sub,
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
