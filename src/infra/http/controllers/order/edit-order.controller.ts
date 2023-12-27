import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditOrderUseCase } from "@/domain/order/application/use-cases/edit-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  EditOrderBodyDto,
  editOrderBodyPipe,
} from "../../dtos/order/edit-order.dto";

@ApiTags("orders")
@ApiBearerAuth("token")
@Controller({ path: "/orders/:id", version: "v1" })
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editOrderBodyPipe) body: EditOrderBodyDto,
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
