import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { OrderFactory } from "test/factories/make-order";
import { OrderAttachmentFactory } from "test/factories/make-order-attachment";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";
import { waitFor } from "test/utils/wait-for";

describe("On order returned (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let attachmentFactory: AttachmentFactory;
  let orderAttachmentFactory: OrderAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        RecipientFactory,
        OrderFactory,
        AttachmentFactory,
        OrderAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    orderAttachmentFactory = moduleRef.get(OrderAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should send notification when order is returned", async () => {
    const administrator = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: administrator.id.toString(),
    });
    const recipient = await recipientFactory.makePrismaRecipient();
    const attachment = await attachmentFactory.makePrismaAttachment();
    const order = await orderFactory.makePrismaOrder({
      postedAt: faker.date.recent({ days: 7 }),
      recipientId: recipient.id,
      deliverymanId: administrator.id,
    });
    await orderAttachmentFactory.makePrismaOrderAttachment({
      orderId: order.id,
      attachmentId: attachment.id,
    });

    await request(app.getHttpServer())
      .post(`/orders/${order.id.toString()}/return`)
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
