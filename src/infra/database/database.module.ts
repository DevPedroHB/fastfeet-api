import { RecipientsRepository } from "@/domain/account/application/repositories/recipients-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { AttachmentsRepository } from "@/domain/order/application/repositories/attachments-repository";
import { OrderAttachmentsRepository } from "@/domain/order/application/repositories/order-attachments-repository";
import { OrdersRepository } from "@/domain/order/application/repositories/orders-repository";
import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { PrismaOrderAttachmentsRepository } from "./prisma/repositories/prisma-order-attachments-repository";
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: OrderAttachmentsRepository,
      useClass: PrismaOrderAttachmentsRepository,
    },
    PrismaService,
  ],
  exports: [
    UsersRepository,
    RecipientsRepository,
    OrdersRepository,
    AttachmentsRepository,
    OrderAttachmentsRepository,
    PrismaService,
  ],
})
export class DatabaseModule {}
