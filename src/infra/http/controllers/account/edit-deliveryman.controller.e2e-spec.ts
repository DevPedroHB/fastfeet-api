import { UserRole } from "@/domain/account/enterprise/entities/user";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Edit deliveryman (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /users/:id", async () => {
    const administrator = await userFactory.makePrismaUser({
      role: UserRole.ADMINISTRATOR,
    });
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: administrator.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .put(`/users/${user.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "New name",
        cpf: "10987654321",
      });

    expect(response.statusCode).toBe(204);

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: "New name",
        cpf: 10987654321,
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
