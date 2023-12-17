import { Faker, en, pt_BR } from "@faker-js/faker";
import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { fabricateUser } from "./factories/fabricate-user";

const client = new PrismaClient();
const faker = new Faker({
  locale: [pt_BR, en],
});

export type Factory = {
  users: User[];
};

interface Tabela {
  tablename: string;
}

async function run() {
  const factory: Factory = {
    users: [],
  };
  const tabelas: Tabela[] = await client.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

  for (const tabela of tabelas) {
    await client.$queryRawUnsafe(`
      TRUNCATE TABLE "${tabela.tablename}" RESTART IDENTITY CASCADE;
    `);
  }

  const hashedPassword = await hash("123456", 8);

  await client.user.create({
    data: {
      name: "Pedro Henrique Bérgamo",
      cpf: "546.112.668-50",
      password: hashedPassword,
      role: "ADMINISTRATOR",
    },
  });

  await fabricateUser({ client, faker, factory });
}

run()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await client.$disconnect();

    process.exit(1);
  });
