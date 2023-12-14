import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditDeliverymanUseCase } from "@/domain/account/application/use-cases/edit-deliveryman";
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

const editDeliverymanBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(11).max(11).transform(Number),
  role: z.enum(["ADMINISTRATOR", "DELIVERYMAN"]).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(editDeliverymanBodySchema);

type EditDeliverymanBodySchema = z.infer<typeof editDeliverymanBodySchema>;

@Controller({ path: "/users/:id", version: "v1" })
export class EditDeliverymanController {
  constructor(private editDeliveryman: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliverymanBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") deliverymanId: string,
  ) {
    const { name, cpf, role } = body;
    const userId = user.sub;

    const result = await this.editDeliveryman.execute({
      deliverymanId,
      name,
      cpf,
      role,
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
  }
}
