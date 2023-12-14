import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateDeliverymanUseCase } from "@/domain/account/application/use-cases/create-deliveryman";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const createDeliverymanBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(11).max(11).transform(Number),
  password: z.string().min(6),
  role: z.enum(["ADMINISTRATOR", "DELIVERYMAN"]).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(createDeliverymanBodySchema);

type CreateDeliverymanBodySchema = z.infer<typeof createDeliverymanBodySchema>;

@Controller({ path: "/users", version: "v1" })
export class CreateDeliverymanController {
  constructor(private createDeliveryman: CreateDeliverymanUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateDeliverymanBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password, role } = body;
    const userId = user.sub;

    const result = await this.createDeliveryman.execute({
      name,
      cpf,
      password,
      role,
      administratorId: userId,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
