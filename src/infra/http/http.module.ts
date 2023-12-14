import { CreateDeliverymanUseCase } from "@/domain/account/application/use-cases/create-deliveryman";
import { DeleteDeliverymanUseCase } from "@/domain/account/application/use-cases/delete-deliveryman";
import { EditDeliverymanUseCase } from "@/domain/account/application/use-cases/edit-deliveryman";
import { FetchDeliverymenUseCase } from "@/domain/account/application/use-cases/fetch-deliverymen";
import { GetDeliverymanUseCase } from "@/domain/account/application/use-cases/get-deliveryman";
import { SignInUseCase } from "@/domain/account/application/use-cases/sign-in";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "./../database/database.module";
import { CreateDeliverymanController } from "./controllers/account/create-deliveryman.controller";
import { DeleteDeliverymanController } from "./controllers/account/delete-deliveryman.controller";
import { EditDeliverymanController } from "./controllers/account/edit-deliveryman.controller";
import { FetchDeliverymenController } from "./controllers/account/fetch-deliverymen.controller";
import { GetDeliverymanController } from "./controllers/account/get-deliveryman.controller";
import { SignInController } from "./controllers/account/sign-in.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    SignInController,
    CreateDeliverymanController,
    EditDeliverymanController,
    DeleteDeliverymanController,
    GetDeliverymanController,
    FetchDeliverymenController,
  ],
  providers: [
    SignInUseCase,
    CreateDeliverymanUseCase,
    EditDeliverymanUseCase,
    DeleteDeliverymanUseCase,
    GetDeliverymanUseCase,
    FetchDeliverymenUseCase,
  ],
})
export class HttpModule {}
