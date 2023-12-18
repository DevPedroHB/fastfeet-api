import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";

describe("Sign in recipient (E2E)", () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[POST] /recipients/sign-in", async () => {
    await recipientFactory.makePrismaRecipient({
      cpf: CPF.create("123.456.789-01"),
      password: await hash("123456", 8),
    });

    const response = await request(app.getHttpServer())
      .post("/recipients/sign-in")
      .send({
        cpf: "123.456.789-01",
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
