import { UserRole } from "@/domain/account/enterprise/entities/user";
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

describe("Edit order (E2E)", () => {
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

  test("[PUT] /orders/:id", async () => {
    const administrator = await userFactory.makePrismaUser({
      role: UserRole.ADMINISTRATOR,
    });
    const accessToken = jwt.sign({
      sub: administrator.id.toString(),
    });
    const recipient = await recipientFactory.makePrismaRecipient();
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "New description",
      });

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        description: "New description",
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
