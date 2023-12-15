import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { FetchUsersUseCase } from "@/domain/account/application/use-cases/fetch-users";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";
import { UserPresenter } from "../../presenters/user-presenter";

const pageQuerySchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema);

type PageQuerySchema = z.infer<typeof pageQuerySchema>;

@Controller({ path: "/users", version: "v1" })
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query("page", queryValidationPipe) page: PageQuerySchema,
  ) {
    const result = await this.fetchUsers.execute({
      administratorId: user.sub,
      page,
      perPage: 20,
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
      users: result.value.users.map(UserPresenter.toHTTP),
    };
  }
}
