import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    PrismaService,
  ],
  exports: [UsersRepository, PrismaService],
})
export class DatabaseModule {}
