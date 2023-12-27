import { DomainEvents } from "@/core/events/domain-events";
import { UserRole } from "@/domain/account/enterprise/entities/user";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";
import { waitFor } from "test/utils/wait-for";

describe("On order withdrawn (E2E)", () => {
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

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should send notification when order is withdrawn", async () => {
    const administrator = await userFactory.makePrismaUser({
      role: UserRole.ADMINISTRATOR,
    });
    const accessToken = jwt.sign({ sub: administrator.id.toString() });
    const recipient = await recipientFactory.makePrismaRecipient();
    const order = await orderFactory.makePrismaOrder({
      postedAt: faker.date.recent({ days: 7 }),
      recipientId: recipient.id,
    });

    await request(app.getHttpServer())
      .post(`/orders/${order.id.toString()}/withdraw`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
