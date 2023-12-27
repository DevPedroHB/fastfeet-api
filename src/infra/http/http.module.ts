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
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { CreateOrderUseCase } from "@/domain/order/application/use-cases/create-order";
import { DeleteOrderUseCase } from "@/domain/order/application/use-cases/delete-order";
import { DeliverOrderUseCase } from "@/domain/order/application/use-cases/deliver-order";
import { EditOrderUseCase } from "@/domain/order/application/use-cases/edit-order";
import { FetchDeliverymanOrdersUseCase } from "@/domain/order/application/use-cases/fetch-deliveryman-orders";
import { FetchRecipientOrdersUseCase } from "@/domain/order/application/use-cases/fetch-recipient-orders";
import { GetOrderByIdUseCase } from "@/domain/order/application/use-cases/get-order-by-id";
import { PostOrderUseCase } from "@/domain/order/application/use-cases/post-order";
import { ReturnOrderUseCase } from "@/domain/order/application/use-cases/return-order";
import { UploadAndCreateAttachmentUseCase } from "@/domain/order/application/use-cases/upload-and-create-attachment";
import { WithdrawOrderUseCase } from "@/domain/order/application/use-cases/withdraw-order";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { LocationModule } from "../location/location.module";
import { StorageModule } from "../storage/storage.module";
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
import { ReadNotificationController } from "./controllers/notification/read-notification.controller";
import { CreateOrderController } from "./controllers/order/create-order.controller";
import { DeleteOrderController } from "./controllers/order/delete-order.controller";
import { DeliverOrderController } from "./controllers/order/deliver-order.controller";
import { EditOrderController } from "./controllers/order/edit-order.controller";
import { FetchDeliverymanOrdersController } from "./controllers/order/fetch-deliveryman-orders.controller";
import { FetchRecipientOrdersController } from "./controllers/order/fetch-recipient-orders.controller";
import { GetOrderByIdController } from "./controllers/order/get-order-by-id.controller";
import { PostOrderController } from "./controllers/order/post-order.controller";
import { ReturnOrderController } from "./controllers/order/return-order.controller";
import { UploadAttachmentController } from "./controllers/order/upload-attachment.controller";
import { WithdrawOrderController } from "./controllers/order/withdraw-order.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, LocationModule, StorageModule],
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
    // Order
    CreateOrderController,
    DeleteOrderController,
    DeliverOrderController,
    EditOrderController,
    FetchDeliverymanOrdersController,
    FetchRecipientOrdersController,
    GetOrderByIdController,
    PostOrderController,
    ReturnOrderController,
    UploadAttachmentController,
    WithdrawOrderController,
    // Notification
    ReadNotificationController,
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
    // Order
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeliverOrderUseCase,
    EditOrderUseCase,
    FetchDeliverymanOrdersUseCase,
    FetchRecipientOrdersUseCase,
    GetOrderByIdUseCase,
    PostOrderUseCase,
    ReturnOrderUseCase,
    UploadAndCreateAttachmentUseCase,
    WithdrawOrderUseCase,
    // Notification
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
