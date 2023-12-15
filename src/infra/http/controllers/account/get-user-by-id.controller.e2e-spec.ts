import { UserRole } from "@/domain/account/enterprise/entities/user";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Get user (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /users/:id", async () => {
    const administrator = await userFactory.makePrismaUser({
      role: UserRole.ADMINISTRATOR,
    });
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: administrator.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name: user.name,
      }),
    });
  });
});
