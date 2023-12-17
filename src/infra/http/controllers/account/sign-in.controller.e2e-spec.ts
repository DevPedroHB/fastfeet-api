import { CPF } from "@/domain/account/enterprise/entities/value-objects/cpf";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Sign in (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test("[POST] /sign-in", async () => {
    await userFactory.makePrismaUser({
      cpf: CPF.create("123.456.789-01"),
      password: await hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/sign-in").send({
      cpf: "123.456.789-01",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
