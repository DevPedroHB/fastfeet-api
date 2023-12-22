import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

describe("Fetch recipient orders (E2E)", () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /recipient/orders", async () => {
    const recipient = await recipientFactory.makePrismaRecipient();
    const accessToken = jwt.sign({
      sub: recipient.id.toString(),
    });

    for (let i = 0; i < 5; i++) {
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
      });
    }

    const response = await request(app.getHttpServer())
      .get(`/recipient/orders`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.orders).toHaveLength(5);
  });
});
