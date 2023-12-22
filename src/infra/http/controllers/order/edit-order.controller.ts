import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditOrderUseCase } from "@/domain/order/application/use-cases/edit-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const editOrderBodySchema = z.object({
  description: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema);

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>;

@Controller({ path: "/orders/:id", version: "v1" })
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") orderId: string,
  ) {
    const { description } = body;

    const result = await this.editOrder.execute({
      orderId,
      description,
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
