import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";

describe("Create order (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /orders", async () => {
    const recipient = await recipientFactory.makePrismaRecipient();
    const accessToken = jwt.sign({
      sub: recipient.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "An example description",
      });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        description: "An example description",
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
