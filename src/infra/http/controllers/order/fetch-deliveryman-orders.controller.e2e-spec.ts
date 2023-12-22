import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Fetch deliveryman orders (E2E)", () => {
  let app: INestApplication;
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

    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /deliveryman/orders", async () => {
    const deliveryman = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
    });
    const recipient = await recipientFactory.makePrismaRecipient();

    for (let i = 0; i < 5; i++) {
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliverymanId: deliveryman.id,
      });
    }

    const response = await request(app.getHttpServer())
      .get("/deliveryman/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.orders).toHaveLength(5);
  });
});
