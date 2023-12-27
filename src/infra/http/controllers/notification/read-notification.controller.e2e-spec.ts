import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/make-notification";
import { RecipientFactory } from "test/factories/make-recipient";

describe("Read notification (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let notificationFactory: NotificationFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    recipientFactory = moduleRef.get(RecipientFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /notifications/:id", async () => {
    const recipient = await recipientFactory.makePrismaRecipient();
    const accessToken = jwt.sign({
      sub: recipient.id.toString(),
    });
    const notification = await notificationFactory.makePrismaNotification({
      recipientId: recipient.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findUnique({
      where: {
        id: notification.id.toString(),
      },
    });

    console.log(notificationOnDatabase);

    expect(notificationOnDatabase?.readAt).not.toBeNull();
  });
});
