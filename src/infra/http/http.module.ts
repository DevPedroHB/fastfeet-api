import { CreateRecipientUseCase } from "@/domain/account/application/use-cases/create-recipient";
import { CreateUserUseCase } from "@/domain/account/application/use-cases/create-user";
import { DeleteRecipientUseCase } from "@/domain/account/application/use-cases/delete-recipient";
import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { EditRecipientUseCase } from "@/domain/account/application/use-cases/edit-recipient";
import { EditRecipientPasswordUseCase } from "@/domain/account/application/use-cases/edit-recipient-password";
import { EditUserUseCase } from "@/domain/account/application/use-cases/edit-user";
import { EditUserPasswordUseCase } from "@/domain/account/application/use-cases/edit-user-password";
import { FetchRecipientsUseCase } from "@/domain/account/application/use-cases/fetch-recipients";
import { FetchUsersUseCase } from "@/domain/account/application/use-cases/fetch-users";
import { GetRecipientByIdUseCase } from "@/domain/account/application/use-cases/get-recipient-by-id";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { SignInRecipientUseCase } from "@/domain/account/application/use-cases/sign-in-recipient";
import { SignInUserUseCase } from "@/domain/account/application/use-cases/sign-in-user";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { LocationModule } from "../location/location.module";
import { DatabaseModule } from "./../database/database.module";
import { CreateRecipientController } from "./controllers/account/create-recipient.controller";
import { CreateUserController } from "./controllers/account/create-user.controller";
import { DeleteRecipientController } from "./controllers/account/delete-recipient.controller";
import { DeleteUserController } from "./controllers/account/delete-user.controller";
import { EditRecipientPasswordController } from "./controllers/account/edit-recipient-password.controller";
import { EditRecipientController } from "./controllers/account/edit-recipient.controller";
import { EditUserPasswordController } from "./controllers/account/edit-user-password.controller";
import { EditUserController } from "./controllers/account/edit-user.controller";
import { FetchRecipientsController } from "./controllers/account/fetch-recipients.controller";
import { FetchUsersController } from "./controllers/account/fetch-users.controller";
import { GetRecipientByIdController } from "./controllers/account/get-recipient-by-id.controller";
import { GetUserByIdController } from "./controllers/account/get-user-by-id.controller";
import { SignInRecipientController } from "./controllers/account/sign-in-recipient.controller";
import { SignInUserController } from "./controllers/account/sign-in-user.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, LocationModule],
  controllers: [
    CreateRecipientController,
    CreateUserController,
    DeleteRecipientController,
    DeleteUserController,
    EditRecipientController,
    EditRecipientPasswordController,
    EditUserController,
    EditUserPasswordController,
    FetchRecipientsController,
    FetchUsersController,
    GetRecipientByIdController,
    GetUserByIdController,
    SignInRecipientController,
    SignInUserController,
  ],
  providers: [
    CreateRecipientUseCase,
    CreateUserUseCase,
    DeleteRecipientUseCase,
    DeleteUserUseCase,
    EditRecipientPasswordUseCase,
    EditRecipientUseCase,
    EditUserPasswordUseCase,
    EditUserUseCase,
    FetchRecipientsUseCase,
    FetchUsersUseCase,
    GetRecipientByIdUseCase,
    GetUserByIdUseCase,
    SignInRecipientUseCase,
    SignInUserUseCase,
  ],
})
export class HttpModule {}
