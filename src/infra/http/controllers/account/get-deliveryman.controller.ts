import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { GetDeliverymanUseCase } from "@/domain/account/application/use-cases/get-deliveryman";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UnauthorizedException,
} from "@nestjs/common";
import { UserPresenter } from "../../presenters/user-presenter";

@Controller({ path: "/users/:id", version: "v1" })
export class GetDeliverymanController {
  constructor(private getDeliveryman: GetDeliverymanUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") deliverymanId: string,
  ) {
    const userId = user.sub;

    const result = await this.getDeliveryman.execute({
      deliverymanId,
      administratorId: userId,
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

    return {
      deliveryman: UserPresenter.toHTTP(result.value.deliveryman),
    };
  }
}
