import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Return order (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /orders/:id/return", async () => {
    const deliveryman = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
    });
    const recipient = await recipientFactory.makePrismaRecipient();
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/return`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    });

    expect(orderOnDatabase?.returnedAt).toEqual(expect.any(Date));
  });
});
