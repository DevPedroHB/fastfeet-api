import { UserRole } from "@/domain/account/enterprise/entities/user";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Fetch users (E2E)", () => {
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

  test("[GET] /users", async () => {
    const administrator = await userFactory.makePrismaUser({
      role: UserRole.ADMINISTRATOR,
    });
    const accessToken = jwt.sign({
      sub: administrator.id.toString(),
    });

    for (let i = 0; i < 5; i++) {
      await userFactory.makePrismaUser();
    }

    const response = await request(app.getHttpServer())
      .get(`/users`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.users).toHaveLength(6);
  });
});
