import { RecipientsRepository } from "@/domain/account/application/repositories/recipients-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";
import { PrismaService } from "./prisma/prisma.service";
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
    PrismaService,
  ],
  exports: [UsersRepository, RecipientsRepository, PrismaService],
})
export class DatabaseModule {}
