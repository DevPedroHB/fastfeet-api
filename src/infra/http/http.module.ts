import { CreateUserUseCase } from "@/domain/account/application/use-cases/create-user";
import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { EditUserUseCase } from "@/domain/account/application/use-cases/edit-user";
import { FetchUsersUseCase } from "@/domain/account/application/use-cases/fetch-users";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { SignInUseCase } from "@/domain/account/application/use-cases/sign-in";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "./../database/database.module";
import { CreateUserController } from "./controllers/account/create-user.controller";
import { DeleteUserController } from "./controllers/account/delete-user.controller";
import { EditUserController } from "./controllers/account/edit-user.controller";
import { FetchUsersController } from "./controllers/account/fetch-users.controller";
import { GetUserByIdController } from "./controllers/account/get-user-by-id.controller";
import { SignInController } from "./controllers/account/sign-in.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    DeleteUserController,
    EditUserController,
    FetchUsersController,
    GetUserByIdController,
    SignInController,
  ],
  providers: [
    CreateUserUseCase,
    DeleteUserUseCase,
    EditUserUseCase,
    FetchUsersUseCase,
    GetUserByIdUseCase,
    SignInUseCase,
  ],
})
export class HttpModule {}
