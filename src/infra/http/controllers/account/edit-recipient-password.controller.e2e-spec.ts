import { UserRole } from "@/domain/account/enterprise/entities/user";
import { AppModule } from "@/infra/app.module";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Edit recipient password (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let bcryptHasher: BcryptHasher;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, BcryptHasher],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    bcryptHasher = moduleRef.get(BcryptHasher);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /recipients/:id/change-password", async () => {
    const administrator = await userFactory.makePrismaUser({
      role: UserRole.ADMINISTRATOR,
    });
    const recipient = await recipientFactory.makePrismaRecipient();
    const accessToken = jwt.sign({
      sub: administrator.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipient.id.toString()}/change-password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        password: "123456",
      });

    expect(response.statusCode).toBe(204);

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        cpf: recipient.cpf.value,
      },
    });

    const passwordMatch = await bcryptHasher.compare(
      "123456",
      recipientOnDatabase!.password,
    );

    expect(passwordMatch).toBeTruthy();
  });
});
